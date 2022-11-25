BINARY_NAME=user-service

build:
	GOARCH=amd64 GOOS=linux go build -o ${BINARY_NAME}-linux ./src

build_and_run: build run

dep:
	go get
run:
	./${BINARY_NAME}

clean:
	go clean
