/**
 * Environment configuration for the service
 * Centralized, type-safe config for all environments
 */

export interface Config {
  stackName: string;
  isDevelopment: boolean;
  vpc: ConfigVpc;
  api: ApiConfig;
  alarm: AlarmConfig;
  // Add other service configs as needed
}

interface ConfigVpc {
  id: string;
  subnetAvailabilityZones: string[];
  subnetIds: string[];
  securityGroupIds: string[];
}

interface ApiConfig {
  allowOriginRegex: string;
  basePathDomain?: string;
  maxContentSizeBytes: number;
}

interface AlarmConfig {
  NotificationTopicArn: string;
}

export const environmentConfigs: Record<string, Config> = {
  development: {
    stackName: 'online-denker-dev',
    isDevelopment: true,
    vpc: {
      id: 'vpc-xxxx',
      subnetAvailabilityZones: ['eu-west-1a'],
      subnetIds: ['subnet-xxxx'],
      securityGroupIds: ['sg-xxxx'],
    },
    api: {
      allowOriginRegex: '*',
      basePathDomain: 'api.dev.example.com',
      maxContentSizeBytes: 3 * 1024,
    },
    alarm: {
      NotificationTopicArn: 'arn:aws:sns:region:account:topic',
    },
  },
  production: {
    stackName: 'online-denker-prod',
    isDevelopment: false,
    vpc: {
      id: 'vpc-yyyy',
      subnetAvailabilityZones: ['eu-west-1a'],
      subnetIds: ['subnet-yyyy'],
      securityGroupIds: ['sg-yyyy'],
    },
    api: {
      allowOriginRegex: 'https://*.example.com',
      basePathDomain: 'api.example.com',
      maxContentSizeBytes: 3 * 1024,
    },
    alarm: {
      NotificationTopicArn: 'arn:aws:sns:region:account:topic',
    },
  },
};

export function getEnvironmentConfig(environment: string = 'development'): Config {
  const config = environmentConfigs[environment];
  if (!config) {
    throw new Error(`Unknown environment: ${environment}. Available: ${Object.keys(environmentConfigs).join(', ')}`);
  }
  return { ...config };
}

export function getAvailableEnvironments(): string[] {
  return Object.keys(environmentConfigs);
}
