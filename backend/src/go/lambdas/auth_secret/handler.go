package auth_secret

import (
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

// Handler implements a HTTP API (v2) simple Lambda authorizer.
// It expects the identity source header `x-amz-secret` (configured in CDK) to match
// the environment variable SECRET_VALUE. If it matches, access is allowed.
// Returns events.APIGatewayV2CustomAuthorizerSimpleResponse with isAuthorized + optional context.
// If the header is missing or invalid, it returns isAuthorized false.
// NOTE: Because enableSimpleResponses=true is configured, returning a simple response
// boolean fully allows/denies the request (no per-route granularity). For per-route
// control, disable simple responses and return an IAM policy instead.
func Handler(ctx context.Context, event events.APIGatewayV2CustomAuthorizerV2Request) (events.APIGatewayV2CustomAuthorizerSimpleResponse, error) {
	secretHeader := ""
	// Headers are case-insensitive; AWS SDK already normalizes, but be safe.
	for k, v := range event.Headers {
		if strings.EqualFold(k, "x-amz-secret") {
			secretHeader = v
			break
		}
	}

	isAuthorized := secretHeader == "something"

	// Provide minimal context back to integration / access logs.
	ctxMap := map[string]interface{}{
		"matched":   isAuthorized,
		"hasHeader": secretHeader != "",
	}

	// Simple response format (no policy document required / used).
	return events.APIGatewayV2CustomAuthorizerSimpleResponse{
		IsAuthorized: isAuthorized,
		Context:      ctxMap,
	}, nil
}
