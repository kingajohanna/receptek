package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserID  string   `json:"user_id"`
	Name    string   `json:"name"`
	Email   string   `json:"email"`
	Picture string   `json:"picture"`
	Recipes []Recipe `gorm:"foreignKey:UserID;references:UserID"`
}

type Recipe struct {
	gorm.Model
	RecipeID   string `json:"recipe_id"`
	IsFavorite bool   `json:"is_favorite"`
	UserID     string `json:"user_id"`
}
