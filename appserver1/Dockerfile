FROM python:3.9-slim-buster

# Install dependencies
RUN apt-get update
RUN apt-get install -y build-essential
# To be able to run ps command
RUN apt-get update && apt-get install -y procps
RUN apt-get update && apt-get install -y curl
RUN /usr/local/bin/python -m pip install --upgrade pip
COPY requirements.txt /opt/
COPY ./ /opt/
WORKDIR /opt/
# RUN /usr/local/bin/python -m pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt --no-cache-dir

# start server
EXPOSE 8080
STOPSIGNAL SIGTERM
CMD ["python", "manage.py", "runserver", "--noreload", "0.0.0.0:8080"]
