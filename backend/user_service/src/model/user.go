package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	UserID    string `json:"user_id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Picture   string `json:"picture"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
