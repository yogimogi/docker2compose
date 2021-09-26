package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

const PORT = 5432

var ErrorNoMatch = fmt.Errorf("no matching record")

type Database struct {
	Conn *sql.DB
}


func Initialize(host, username, password, database string) (Database, error) {
	db := Database{}
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, PORT, username, password, database)
	connection, error := sql.Open("postgres", dsn)
	if error != nil {
		return db, error
	}

	db.Conn = connection

	error = db.Conn.Ping()
	if error != nil {
		return db, error
	}
	log.Printf("Database connection established[host=%s, port=%d, dbname=%s].", host, PORT, database)
	return db, nil
}
