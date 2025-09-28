import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import * as fs from 'fs';

export interface LambdaFunctionConstructProps {
  functionName: string;
  environment?: { [key: string]: string };
  timeout?: cdk.Duration;
}

export class LambdaFunctionConstruct extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaFunctionConstructProps) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
      functionName: props.functionName,
      // Each lambda has its own directory containing a 'bootstrap' executable built by the build script.
      code: lambda.Code.fromAsset(getLambdaAssetDirectory(props.functionName)),
      // For custom (PROVIDED_AL2) runtimes the entrypoint must be an executable named 'bootstrap'.
      // The handler value is still required by CloudFormation but not used by Lambda when using a custom runtime.
      handler: 'bootstrap',
      runtime: lambda.Runtime.PROVIDED_AL2,
      environment: props.environment,
      timeout: props.timeout || cdk.Duration.seconds(10),
    });
  }
}

function getLambdaAssetDirectory(lambdaName: string): string {
  // Expected structure after build:
  // dist/go-lambdas/{lambdaName}/bootstrap
  const lambdaDir = path.join('dist', 'go-lambdas', lambdaName);
  const absoluteBootstrap = path.join(process.cwd(), lambdaDir, 'bootstrap');
  if (!fs.existsSync(absoluteBootstrap)) {
    throw new Error(
      `Lambda bootstrap not found for ${lambdaName} at ${absoluteBootstrap}. ` +
      `Run the build script first: ./scripts/build-lambdas.sh`
    );
  }
  return lambdaDir;
}
