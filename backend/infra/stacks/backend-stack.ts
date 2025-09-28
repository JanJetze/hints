import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaFunctionConstruct } from '../constructs/lambda-function';
import { ApiConstruct } from '../constructs/api';
import { getEnvironmentConfig, Config } from '../config/environment';

export interface BackendStackProps extends cdk.StackProps {
  environment: string;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const config: Config = getEnvironmentConfig(props.environment);

    const helloLambda = new LambdaFunctionConstruct(this, 'HelloLambda', {
      functionName: 'hello_world',
      environment: {},
    });

    const authSecret = new LambdaFunctionConstruct(this, 'AuthSecret', {
      functionName: 'auth_secret',
      environment: {},
    });

    const authKey = new LambdaFunctionConstruct(this, 'AuthKey', {
      functionName: 'auth_key',
      environment: {},
    });

    const userApi = new ApiConstruct(this, 'UserApi', {
      lambdaFunction: helloLambda,
      authorizerFunction: authKey,
    });
    const adminApi = new ApiConstruct(this, 'AdminApi', {
      lambdaFunction: helloLambda,
      authorizerFunction: authSecret,
    });

    // Output the Admin API endpoint
    new cdk.CfnOutput(this, 'AdminApiEndpoint', {
      value: `https://${adminApi.api.ref}.execute-api.${this.region}.amazonaws.com/prod`,
      exportName: `${props.environment}-AdminApiEndpoint`,
    });
    // Output the User API endpoint
    new cdk.CfnOutput(this, 'UserApiEndpoint', {
      value: `https://${userApi.api.ref}.execute-api.${this.region}.amazonaws.com/prod`,
      exportName: `${props.environment}-UserApiEndpoint`,
    });
  }
}
