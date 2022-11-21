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

		err := db.Create(&recipe).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"data": "no corresponding user"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"data": recipe.ID})
	})
}

func GetRecipe(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var recipe model.Recipe
		err := db.Where(&model.Recipe{RecipeID: c.Param("recipeid"), UserID: c.Param("userid")}).First(&recipe).Error
		if err != nil {
			c.Next()
		}
		c.Set("recipe", recipe)
	})
}

func GetAllRecipes(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var recipeIDs []string
		err := db.Model(&model.Recipe{}).Select("RecipeID").Where().Find(&recipeIDs).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"data": "user is not found"})
			return
		}
		c.JSON(http.StatusOK, recipeIDs)
	})
}

func AddFavorite(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		val, exists := c.Get("recipe")
		recipe, ok := val.(model.Recipe)
		if !exists || !ok {
			c.JSON(http.StatusNotFound, gin.H{"data": "recipeID is not in database"})
			return
		}
		err := db.Model(&recipe).Update("IsFavorite", !recipe.IsFavorite).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"data": "cannot update recipe"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": "favorite added"})
	})
}

func DelRecipe(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		val, exists := c.Get("recipe")
		recipe, ok := val.(model.Recipe)
		if !exists || !ok {
			c.JSON(http.StatusAccepted, gin.H{"data": "recipeID is not in database"})
			return
		}
		err := db.Delete(&recipe).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"data": "cannot delete recipe"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": "deleted"})
	})
}
