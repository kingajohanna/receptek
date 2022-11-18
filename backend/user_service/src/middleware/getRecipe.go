package middleware

import (
	"fmt"
	model "receptek/user_service/src/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetRecipe(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var recipe model.Recipe
		if db.Where(&model.Recipe{RecipeID: c.Param("recipeid")}).First(&recipe).Error != nil {
			c.Set("err", fmt.Sprintf("can not find recipe with ID: %s", c.Param("recipeid")))
		}
		c.Set("recipe", recipe)
	})
}
