# Build the Golang app inside a golang based container image
FROM golang:1.17.1-alpine3.13 as buildstage

COPY go.mod go.sum /go/src/appserver2/
WORKDIR /go/src/appserver2
RUN go mod download
COPY . /go/src/appserver2
# Read below to know what CGO_ENABLED=0 means
# https://jpetazzo.github.io/2020/03/01/quest-minimal-docker-images-part-2/
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o build/appserver2 appserver2

# Create the final container image
FROM alpine
# FROM scratch
COPY --from=buildstage /go/src/appserver2/build/appserver2 /usr/bin/appserver2
ENTRYPOINT ["/usr/bin/appserver2"]
