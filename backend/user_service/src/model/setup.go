package model

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func ConnectDB(DBhost, DBuser, DBpassword, DBname string, DBport int) (*gorm.DB, error) {
	fmt.Println(DBhost, DBuser, DBpassword, DBname, DBport)
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", DBhost, DBport, DBuser, DBpassword, DBname), // disables implicit prepared statement usage
	}), &gorm.Config{})
	failOnError(err, fmt.Sprintf("Failed to connect to DB on address %s:%d", DBhost, DBport))

	return db, err
}
