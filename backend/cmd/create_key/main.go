package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cloudformation"
)

func getApiEndpoint(ctx context.Context, cfClient *cloudformation.Client, stackName string) (string, error) {
	resp, err := cfClient.DescribeStacks(ctx, &cloudformation.DescribeStacksInput{
		StackName: &stackName,
	})
	if err != nil {
		return "", fmt.Errorf("unable to describe stack: %w", err)
	}
	for _, stack := range resp.Stacks {
		for _, output := range stack.Outputs {
			if output.OutputKey != nil && *output.OutputKey == "AdminApiEndpoint" {
				return *output.OutputValue, nil
			}
		}
	}
	return "", fmt.Errorf("AdminApiEndpoint not found in stack outputs")
}

func invokeChatEndpoint(apiEndpoint string) error {
	url := fmt.Sprintf("%s/chat/123abc/message", apiEndpoint)
	fmt.Println(url)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Add("x-amz-secret", "something")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to invoke /chat endpoint: %w", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}
	fmt.Println(string(body))
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return fmt.Errorf("failed to parse response: %w", err)
	}
	fmt.Printf("Response: %v\n", result)
	return nil
}

func main() {
	var stackName, profile string
	flag.StringVar(&stackName, "stack", "", "Name of the CloudFormation stack")
	flag.StringVar(&profile, "profile", "default", "AWS CLI profile to use")
	flag.Parse()
	if stackName == "" {
		fmt.Println("--stack parameter is required")
		os.Exit(1)
	}
	ctx := context.Background()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithSharedConfigProfile(profile))
	if err != nil {
		fmt.Printf("Error loading AWS config: %v\n", err)
		os.Exit(1)
	}

	cfClient := cloudformation.NewFromConfig(cfg)

	apiEndpoint, err := getApiEndpoint(ctx, cfClient, stackName)
	if err != nil {
		fmt.Printf("Error getting API endpoint: %v\n", err)
		os.Exit(1)
	}
	if err := invokeChatEndpoint(apiEndpoint); err != nil {
		fmt.Printf("Error invoking /chat endpoint: %v\n", err)
		os.Exit(1)
	}
}
