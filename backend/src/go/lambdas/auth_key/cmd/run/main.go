package main

import (
	"github.com/JanJetze/game/src/go/lambdas/auth_key"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(auth_key.Handler)
}
