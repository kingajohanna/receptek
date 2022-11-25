package messaging

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type MQ struct {
	conn *amqp.Connection
	CH   *amqp.Channel
	Q    amqp.Queue
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func ConnectToMessageBroker(host, user, password string, port int) *MQ {
	var err error

	conn, err := amqp.Dial(fmt.Sprintf("amqp://%s:%s@%s:%d/", user, password, host, port))
	failOnError(err, fmt.Sprintf("Failed to connect to RabbitMQ on address %s:%d", host, port))

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")

	q, err := ch.QueueDeclare(
		"hello", // name
		false,   // durable
		true,    // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	failOnError(err, "Failed to declare a queue")
	return &MQ{conn: conn, CH: ch, Q: q}
}

func (mq *MQ) Close() {
	mq.CH.Close()
	mq.conn.Close()
}
