package middleware

import (
	"net/http"
	model "receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddRecipe(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		recipe := model.Recipe{RecipeID: c.Param("recipeid"), UserID: c.Param("userid")}

		if db.Create(&recipe).Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no corresponding user"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"data": recipe.ID})
	})
}
