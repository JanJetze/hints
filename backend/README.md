

# Online Denker Backend

This backend is structured following the [chat-service](https://github.com/plinkrlabs/chat-service) architecture for scalable, maintainable serverless applications.

## Key Features
- **Centralized TypeScript config**: All environment settings in `src/typescript/config/environment.ts`
- **Single Lambda build script**: `scripts/build-lambdas.sh` for Go Lambda functions
- **Modular CDK constructs**: (to be added) for VPC, API, Lambda, etc.
- **Makefile**: Unified commands for build, deploy, test, clean, and config
- **No .env files**: All config is type-safe and in code

## Quick Start

```bash
# Install dependencies
npm install

# Build Go Lambda functions
make build

# Show config for an environment
make show-config ENV=development

# Deploy to AWS
make deploy ENV=development

# Run tests
make test

# Clean build artifacts
make clean
```

## Configuration
See `src/typescript/config/environment.ts` for all environment-specific settings.

## Structure
- `src/typescript/config/environment.ts` - All environment config
- `src/typescript/bin/backend.ts` - CDK app entrypoint
- `src/typescript/lib/backend-stack.ts` - Main stack (modularize as needed)
- `scripts/build-lambdas.sh` - Build all Go Lambda functions
- `Makefile` - Build/test/deploy/clean commands

## Next Steps
- Modularize constructs (VPC, Lambda, API, etc.) in `src/typescript/constructs/`
- Add monitoring, alarms, and outputs as in chat-service
- Expand config as needed for your use case

## Authorization (HTTP API Lambda Authorizers)
Two Lambda authorizers are provisioned:

- `auth_key` (payload format 1.0 style returning IAM policy) – currently unused by routes configured with simple responses but kept for comparison.
- `auth_secret` (payload format 2.0 simple response) – validates a shared secret header.

Both APIs (`UserApi`, `AdminApi`) are created with a REQUEST Lambda Authorizer referencing either `auth_key` or `auth_secret` respectively. The authorizer identity source is:

```
$request.header.x-amz-secret
```

`auth_secret` expects an environment variable `SECRET_VALUE` to be set on the Lambda. If the incoming request header `x-amz-secret` matches this value the authorizer returns:

```json
{
	"isAuthorized": true,
	"context": { "matched": true, "hasHeader": true }
}
```

Otherwise it returns `isAuthorized: false`.

Because `enableSimpleResponses` is set to `true` in the CDK construct, the boolean result fully allows or denies the invocation (no fine‑grained per‑route policy). If you need per‑route granularity or partial authorization you can:

1. Disable `enableSimpleResponses`.
2. Return an IAM policy (like `auth_key` does) listing specific `execute-api:Invoke` resources.

### Setting the Secret
Add the environment variable to the Lambda in the CDK code (example):

```ts
const authSecret = new LambdaFunctionConstruct(this, 'AuthSecret', {
	functionName: 'auth_secret',
	environment: { SECRET_VALUE: 'super-secret-token' },
});
```

Then deploy:

```bash
make deploy ENV=development
```

### Calling a Protected Endpoint
```bash
curl -H 'x-amz-secret: super-secret-token' https://<api-id>.execute-api.<region>.amazonaws.com/prod/chat
```

Expect `401` if header missing or incorrect.

### Future Enhancements
- Add caching via `authorizerResultTtlInSeconds` if secret changes infrequently.
- Migrate to JWT authorizer for multi-tenant or user‑level claims.
- Enforce rotation / retrieval of secret from AWS Secrets Manager.
- Add structured logging of authorization decisions.

---
Inspired by [plinkrlabs/chat-service](https://github.com/plinkrlabs/chat-service)
