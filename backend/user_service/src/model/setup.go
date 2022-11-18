package model

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB(DBhost, DBuser, DBpassword, DBname string, DBport int) (*gorm.DB, error) {
	fmt.Println(DBhost, DBuser, DBpassword, DBname, DBport)
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", DBhost, DBport, DBuser, DBpassword, DBname), // disables implicit prepared statement usage
	}), &gorm.Config{})
	return db, err
}
