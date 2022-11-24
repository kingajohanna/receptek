package middleware

import (
	"context"
	"encoding/json"
	"log"
	"receptek/user_service/src/messaging"
	"receptek/user_service/src/model"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func NotifyUserDeletion(user model.User, mq *messaging.MQ) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	delUserRecipes := messaging.DeleteUserRecipes{UserID: user.UserID}
	b, _ := json.Marshal(delUserRecipes)
	err := mq.CH.PublishWithContext(ctx,
		"",        // exchange
		mq.Q.Name, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        b,
		})
	if err != nil {
		log.Printf("Could not send message")
	}
	log.Printf(" [x] Sent %s\n", b)
	defer cancel()
}
