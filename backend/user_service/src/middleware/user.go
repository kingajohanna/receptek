package middleware

import (
	"net/http"
	"receptek/user_service/src/messaging"
	model "receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type createUserInput struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required"`
	Picture string `json:"picture"`
}

func AddUser(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var user_request createUserInput
		err := c.ShouldBindJSON(&user_request)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		user := model.User{UserID: c.Request.Header["X-User"][0], Name: user_request.Name, Email: user_request.Email, Picture: user_request.Picture}
		db.Create(&user)
		c.JSON(http.StatusOK, gin.H{"data": user.UserID})
	})
}

func GetUser(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var user model.User
		err := db.Where(&model.User{UserID: c.Param("userid")}).First(&user).Error
		if err != nil {
			c.Next()
		}
		c.Set("user", user)
	})
}

func DelUser(db *gorm.DB, mq *messaging.MQ) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		val, exists := c.Get("user")
		user, ok := val.(model.User)
		if !exists || !ok {
			c.JSON(http.StatusAccepted, gin.H{"data": "user_ID is not in database"})
			return
		}
		err := db.Unscoped().Delete(&user).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"data": "cannot delete user"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": "deleted"})
		go NotifyUserDeletion(user, mq)
	})
}
