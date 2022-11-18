package middleware

import (
	"net/http"
	model "receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type createUserInput struct {
	UserID  string `json:"userid" binding:"required"`
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

		user := model.User{UserID: user_request.UserID, Name: user_request.Name, Email: user_request.Email, Picture: user_request.Picture, Recipes: []model.Recipe{{RecipeID: "12c"}}}
		db.Create(&user)
		c.JSON(http.StatusOK, gin.H{"data": user.ID})
	})
}
