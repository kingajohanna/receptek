package messaging

import (
	"fmt"
	"log"
	utils "receptek/user_service/src/utils"
	"time"

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

func ConnectToMessageBroker(host, user, password, queue string, port int) *MQ {
	var err error
	cb := &utils.CircuitBreaker{TimeInterval: time.Second, MaxFailures: 10, MaxOpenEnters: 2, MinSuccesses: 3}
	res, err := cb.ConnectRetry(func() (any, error) { return amqp.Dial(fmt.Sprintf("amqp://%s:%s@%s:%d/", user, password, host, port)) }, 10, 500*time.Millisecond)
	failOnError(err, fmt.Sprintf("Failed to connect to RabbitMQ on address %s:%d", host, port))
	conn, ok := res.(*amqp.Connection)
	if !ok {
		failOnError(fmt.Errorf("connection is invalid type"), "connection is invalid type")
	}
	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")

	q, err := ch.QueueDeclare(
		queue, // name
		false, // durable
		true,  // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnError(err, "Failed to declare a queue")
	return &MQ{conn: conn, CH: ch, Q: q}
}

func (mq *MQ) Close() {
	mq.CH.Close()
	mq.conn.Close()
}
