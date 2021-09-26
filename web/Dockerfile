# Build the react app inside a node based container image
FROM node:latest as buildstage
LABEL author="Yogesh Ketkar"
WORKDIR /webapp
COPY . .
RUN npm install
RUN npm run build

# Create the final container image
FROM nginx:alpine
COPY --from=buildstage /webapp/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf