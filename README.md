## A simple application deployed with containers

We will see here how to deploy an application with docker and docker-compose. Application has

1. A Python based REST server (appserver1)  
   It fetches data from Postgresql and Redis; also implements some contrived API throttling.
2. A Golang based REST server (appserver2)  
   It fetches data from Postgresql.
3. A Postgres database server  
   It just has 2 tables, one holds list of some amazing mathematicians and the other list of some popular programming languages.
4. A Redis server  
   Keeps a list of some interesting numbers and is used to implement API throttling.
5. A web application which connects to both the REST servers  
   Written in React and hosted on NGINX, shows deployment architecture using [reactflow](https://reactflow.dev/) and basically fetches data from Redis and Postgresql through appserver1 and appserver2.

Here is the deployment architecture.
![alt text](https://github.com/yogimogi/docker2compose/blob/master/appdeployment.png)

### Setup with docker

Clone the repository and follow these instructions.

1. Create a network where all the containers would get created.

```
docker network create yo-network
# Make sure, network created earlier gets listed with below command
docker network ls
```

2. Create image and container for Postgresql. We create the tables in init-db.sh file which in turn is copied to /docker-entrypoint-initdb.d/ directory as part of image creation which has the effect of creating these tables (along with the data) at the time of container creation.

```
cd db
docker build -t yo-db .
docker run -d --network yo-network --name dbserver -e POSTGRES_PASSWORD=Admin@123 yo-db
# connect to db container and check data
docker exec -it dbserver bash
psql -U postgres
# list databases
postgres=# \l
postgres=# select * from languages;
postgres=# select * from mathematicians;
```

Couple of things to note:

- We haven't mapped port 5432 of the dbserver container to any port on the host. So there is no easy way to access database directly from the host.
- We created dbserver inside the network yo-network. If you inspect the network with the command below, you will see ip address for container dbserver. We will create all the remaining containers in the same network.

```
docker network inspect yo-network
```

3. Create a container from redis image. Even for this container, we are not mapping port 6379 on the host.

```
docker run -d --network yo-network --name redisserver redis
```

4. Create image and the container for appserver1. Image is based on python:3.9-slim-buster image and it runs Django application server on port 8080 of the container. We create the container in the same network and access Postgresql and Redis using their container names.

```
cd ../appserver1
docker build  -t yo-appserver1 .
docker run -d --network yo-network --name appserver1 -p 8080:8080 -e DB_NAME=postgres -e DB_USER=postgres -e DB_PASSWORD=Admin@123 -e DB_HOST=dbserver -e REDIS_HOST=redisserver yo-appserver1
```

- Try hitting below endpoints

[mathematicians](http://localhost:8080/mathematicians)  
[mathematician with id 2](http://localhost:8080/mathematicians/2)  
[cache](http://localhost:8080/cache)

- For the below endpoint, keep on refreshing browser window, after 10 hits you will get 429 http response

[throttling](http://localhost:8080/cache/limit)

When creating appserver1 container, we mapped port 8080 of appserver1 to port 8080 of the host just to test if appserver1 is able to connect to both Postgresql server and Redis server. Now run below commands to delete the container and create it without port mapping on the host. When creating appserver1 container, we are passing all the connection details as environment variables to the container using -e command line option.

```
docker rm -f appserver1
docker run -d --network yo-network --name appserver1 -e DB_NAME=postgres -e DB_USER=postgres -e DB_PASSWORD=Admin@123 -e DB_HOST=dbserver -e REDIS_HOST=redisserver yo-appserver1
```

When containers are part of the same network, they can reach to each other using container name as the host name. Docker takes care of setting up the DNS.

```
docker exec -it dbserver bash
# run below command inside dbserver container
nslookup appserver1
wget http://appserver1:8080/cache/limit
```

5. Create image and the container for appserver2. As appserver2 is written in Go, we need to build the exe before running appserver2. We can potentially build the exe on local machine but that would mean having to install Go on the machine where you are building the image, instead, we have used standard multi-stage build approach where we do the build by copying the code to an image based on golang:1.17.1-alpine3.13 which already has all the go tools to do the build. Once build is done, we copy the exe to another image based on alpine.

```
cd ../appserver2
docker build  -t yo-appserver2 .
docker run -d --network yo-network  --name appserver2 -v "$(pwd)/.env-dev:/opt/appserver2.env" -p 8081:8080 yo-appserver2
```

- Try hitting below endpoints

[languages](http://localhost:8081/languages)  
[language with id 1](http://localhost:8081/languages/1)

Again, we mapped port 8080 of the application server2 to port 8081 of the host just to test if appserver2 is able to connect to Postgresql server. Now run below commands to delete the container and create it without port mapping on the host.mand line option.

```
docker rm -f appserver2
docker run -d --network yo-network  --name appserver2 -v "$(pwd)/.env-dev:/opt/appserver2.env" yo-appserver2
```

6. Create image and the container for webapp. Even here we have used multi-stage build to build the final react bundle. Build happens on an image based on node and final react bundle gets copied to an image based on nginx:alpine. As we want to access the application from the host, we have mapped nginx port 80 to the host port 80. React application makes REST calls to appserver1 and appserver2. It's a good idea to proxy these calls through nginx itself as opposed to directly hitting these apps from the browser. This is taken care of by nginx.conf file which we copy as /etc/nginx/conf.d/default.conf inside nginx image.

```
cd ../web
docker build  -t yo-web .
docker run -d -p 80:80 --network yo-network --name webapp yo-web
```

You can access the applicaion at the below URL.  
[webapp](http://localhost/)

You can cleanup the containers and the network using below commands.

```
docker rm -f dbserver
docker rm -f redisserver
docker rm -f appserver1
docker rm -f appserver2
docker rm -f webapp
docker network prune -f
```

### Setup with docker-compose

Though the approach of using docker command line is easy to get started with, it becomes very limiting. If you are writing scripts to manage deployments, these are not going to be repeatable unless you take special care in writing them. Say, when you run the script to start all 5 containers the very first time, only 4 containers come up and there is some error brining up the fifth container. Say error is related to wrong image name specified in the script for the fifth container. Now if you fix the script and run it again, unless your script does right checks for the containers which are already running it's just not going to work. Also, **docker run** command will keep on getting complex when you want to mount different volumes, restart the container when something goes wrong, pass all environment variables etc. docker-compose takes care of a lot of these issues. It is a declarative way of setting up a containerized application where you specify the desired state of the application. docker-compose is

- A specification for describing an application model in a YML file.
- A command line tool to connect to docker engine and do the deployments.
