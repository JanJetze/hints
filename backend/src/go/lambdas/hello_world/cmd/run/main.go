package main

import (
	"github.com/JanJetze/game/src/go/lambdas/hello_world"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(hello_world.Handler)
}
