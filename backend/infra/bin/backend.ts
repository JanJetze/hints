#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../stacks/backend-stack';
import { getEnvironmentConfig, getAvailableEnvironments } from '../config/environment';

const environment = process.env.CDK_ENVIRONMENT || 'development';
const availableEnvironments = getAvailableEnvironments();
if (!availableEnvironments.includes(environment)) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.error(`Available environments: ${availableEnvironments.join(', ')}`);
  process.exit(1);
}

const config = getEnvironmentConfig(environment);
const account = process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID;
const region = process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'eu-west-1';

console.log(`🚀 Deploying Backend to environment: ${environment}`);
console.log(`   Stack: ${config.stackName}`);
console.log(`   Account: ${account || 'auto-detected'}`);

const app = new cdk.App();
new BackendStack(app, config.stackName, {
  env: { account, region },
  environment,
});
