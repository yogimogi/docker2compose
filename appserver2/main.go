package main

import (
	"appserver2/db"
	"appserver2/handler"
	"context"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
)

func init() {
	// Reads settings from an environemtn file and makes them
	// available as environment variables
	envFile := ".env-local"
	_, error := os.Stat(envFile);
	if (errors.Is(error, fs.ErrNotExist)) {
		// useful in the context of containers
		// Either 
		// (1) mount some local .env file to /opt/appserver2.env file at the time
		//     of container creation
		// (2) or COPY local .env file to /opt/appserver2.env when creating the image
		envFile = "/opt/appserver2.env"
	}
	if error := godotenv.Load(envFile); error != nil {
		log.Fatalf("Error reading .env file: %s", error.Error())
	}
}

func main() {
	address := ":8080"
	listener, error := net.Listen("tcp", address)
	if error != nil {
		log.Fatalf("Error starting service: %s", error.Error())
	}

	dbHost, dbUser, dbPassword, dbDatabase := os.Getenv("POSTGRES_HOST"), os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_DATABASE")

	database, error := db.Initialize(dbHost, dbUser, dbPassword, dbDatabase)
	if error != nil {
		log.Fatalf("Could not set up database: %v", error)
	}
	defer database.Conn.Close()

	httpHandler := handler.NewHandler(database)
	server := &http.Server{
		Handler: httpHandler,
	}

	go func() {
		server.Serve(listener)
	}()

	defer Stop(server)

	log.Printf("Started server on %s", address)

	// listen for ctrl+c signal from terminal
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	log.Println(fmt.Sprint(<-ch))
	log.Println("Stopping API server.")
}

func Stop(server *http.Server) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Could not shut down server correctly: %v\n", err)
		os.Exit(1)
	}
}
