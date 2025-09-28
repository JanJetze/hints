package auth_key

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
)

func Handler(ctx context.Context, event events.APIGatewayCustomAuthorizerRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID:    "user",
		PolicyDocument: allowPolicy(event.MethodArn),
	}, nil
}

func allowPolicy(resource string) events.APIGatewayCustomAuthorizerPolicy {
	return events.APIGatewayCustomAuthorizerPolicy{
		Version: "2012-10-17",
		Statement: []events.IAMPolicyStatement{
			{
				Action:   []string{"execute-api:Invoke"},
				Effect:   "Allow",
				Resource: []string{resource},
			},
		},
	}
}
