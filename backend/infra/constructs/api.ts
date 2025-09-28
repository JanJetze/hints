
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { LambdaFunctionConstruct } from './lambda-function';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

export interface ApiConstructProps {
    lambdaFunction: LambdaFunctionConstruct;
    authorizerFunction: LambdaFunctionConstruct;
}

export class ApiConstruct extends Construct {
    public readonly api: apigatewayv2.CfnApi;
    public readonly integration: apigatewayv2.CfnIntegration;
    public readonly authorizer: apigatewayv2.CfnAuthorizer;
    constructor(scope: Construct, id: string, props: ApiConstructProps) {
        super(scope, id);

        this.api = new apigatewayv2.CfnApi(this, 'Api', {
            name: `${id}-api`,
            protocolType: 'HTTP',

        });

        const stage = new apigatewayv2.CfnStage(this, 'ApiStage', {
            apiId: this.api.ref,
            stageName: 'prod',  
            autoDeploy: true,
        });

        props.lambdaFunction.lambdaFunction.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        props.authorizerFunction.lambdaFunction.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));
        this.authorizer = new apigatewayv2.CfnAuthorizer(this, 'ApiAuthorizer', {
            apiId: this.api.ref,
            authorizerType: 'REQUEST',
            name: 'LambdaAuthorizer',
            authorizerUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${props.authorizerFunction.lambdaFunction.functionArn}/invocations`,
            identitySource: ['$request.header.x-amz-secret'],
            authorizerPayloadFormatVersion: '2.0',
            enableSimpleResponses: true,
        });

        this.integration = new apigatewayv2.CfnIntegration(this, 'ApiIntegration', {
            apiId: this.api.ref,
            integrationType: 'AWS_PROXY',
            integrationUri: props.lambdaFunction.lambdaFunction.functionArn,
            payloadFormatVersion: '2.0',
        });

        new ApiRouteConstruct(this, 'DefaultRoute', {
            api: this,
            routeKey: 'GET /chat',
        });
        new ApiRouteConstruct(this, 'SecondRoute', {
            api: this,
            routeKey: 'GET /chat/{id}/message',
        });
    }
}

interface ApiRouteConstructProps {
    api: ApiConstruct;
    routeKey: string;
}

class ApiRouteConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ApiRouteConstructProps) {
        super(scope, id);

        const route = new apigatewayv2.CfnRoute(this, 'ApiRoute', {
            apiId: props.api.api.ref,
            routeKey: props.routeKey,
            target: `integrations/${props.api.integration.ref}`,
            authorizationType: 'CUSTOM',
            authorizerId: props.api.authorizer.ref,
        });
    }
}
