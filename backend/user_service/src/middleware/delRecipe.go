package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DelRecipe(db *gorm.DB) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {

		if db.Delete(&c.Get("recipe")).Error != nil {
			c.JSON(http.StatusForbidden, gin.H{"data": "cannot delete recipe with ID "})
		}
		c.JSON(http.StatusOK, gin.H{"data": "deleted"})
	})
}
