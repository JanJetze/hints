package hello_world

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

var routeMap = map[string]func(context.Context, events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error){
	"GET /chat":                   chatListHandler,
	"GET /chat/{chat_id}/message": chatMessageList,
}

func Handler(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	b, err := json.Marshal(request)
	if err != nil {
		return events.APIGatewayV2HTTPResponse{
			StatusCode: 500,
			Body:       "Internal Server Error",
		}, nil
	}
	fmt.Println(string(b))
	handler, ok := routeMap[request.RouteKey]
	if ok {
		return handler(ctx, request)
	}
	return events.APIGatewayV2HTTPResponse{
		StatusCode: 404,
		Body:       "Not Found",
	}, nil
}

func chatListHandler(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return events.APIGatewayV2HTTPResponse{
		StatusCode: 200,
		Body:       "List of chats",
	}, nil
}

func chatMessageList(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return events.APIGatewayV2HTTPResponse{
		StatusCode: 200,
		Body:       "List of messages in chat",
	}, nil
}
