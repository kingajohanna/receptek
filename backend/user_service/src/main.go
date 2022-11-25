package main

import (
	"fmt"
	"log"
	"net/http"
	conf "receptek/user_service/src/config"
	"receptek/user_service/src/messaging"
	MW "receptek/user_service/src/middleware"
	"receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigName("config.yaml")
	viper.AddConfigPath("../config")
	//viper.AutomaticEnv()
	viper.SetConfigType("yml")
	var configuration conf.Configurations
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error reading config file, %s", err)
	}
	//viper.SetDefault("database.dbname", "test_db")
	err := viper.Unmarshal(&configuration)
	if err != nil {
		log.Printf("Unable to decode config into struct, %v", err)
	}

	db, err := model.ConnectDB(configuration.Database.DBHost,
		configuration.Database.DBUser,
		configuration.Database.DBPassword,
		configuration.Database.DBName,
		configuration.Database.DBPort)
	if err != nil {
		log.Panicf("Failed to connect to Database on address %s:%d", configuration.Database.DBHost, configuration.Database.DBPort)
	}
	mq := messaging.ConnectToMessageBroker(configuration.RabbitMQ.Host,
		configuration.RabbitMQ.Username,
		configuration.RabbitMQ.Password,
		configuration.RabbitMQ.Queue,
		configuration.RabbitMQ.Port)
	defer mq.Close()
	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "hello world"})
	})

	router.POST("/user/add/", MW.AddUser(db))
	router.DELETE("/user/del/:userid/", MW.GetUser(db), MW.DelUser(db, mq))

	router.Run(fmt.Sprintf("0.0.0.0:%d", configuration.Server.Port))
}
