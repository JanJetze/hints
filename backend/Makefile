# Makefile for Online Denker backend (chat-service style)

.PHONY: build deploy test clean show-config
ENV ?= development
AWS_PROFILE ?= private-playground

build:
	@echo "🔨 Building Lambda functions..."
	@./scripts/build-lambdas.sh
	@echo "✅ Lambda functions built successfully!"

deploy:
	@echo "🚀 Deploying to environment: $(ENV)"
	@npm run build
	@CDK_ENVIRONMENT=$(ENV) npx cdk deploy --require-approval never --profile $(AWS_PROFILE)
	@echo "✅ Deployment complete!"

test:
	@echo "🧪 Running all tests..."
	@go test ./src/...

clean:
	@echo "🧹 Cleaning build artifacts..."
	@find src/go/lambda -name "bin" -type d -exec rm -rf {} + 2>/dev/null || true
	@rm -rf cdk.out/
	@rm -rf dist/
	@echo "✅ Clean complete!"

show-config:
	@echo "🔍 Configuration for environment: $(ENV)"
	@CDK_ENVIRONMENT=$(ENV) npx ts-node -e "import { getEnvironmentConfig } from './src/typescript/config/environment'; const config = getEnvironmentConfig('$(ENV)'); console.log('   Stack:', config.stackName); console.log('   Development Mode:', config.isDevelopment);"
