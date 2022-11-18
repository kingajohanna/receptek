package main

import (
	"fmt"
	"log"
	"net/http"
	conf "receptek/user_service/src/config"
	MW "receptek/user_service/src/middleware"
	model "receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigName("config.yaml")
	viper.AddConfigPath("./config")
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
		log.Panicf("Cannot connect to DB on address ")
	}

	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "hello world"})
	})

	router.POST("/user/add", MW.AddUser(db))

	router.GET("/user/:userid/add/:recipeid", MW.AddRecipe(db))
	router.GET("/user/:userid/add/:recipeid/favorite")
	router.DELETE("/user/:userid/del/:recipeid", MW.GetRecipe(db), MW.DelRecipe(db))

	router.Run(fmt.Sprintf("0.0.0.0:%d", configuration.Server.Port))
}
