import * as ec2 from '@aws-cdk/aws-ec2'
import * as lambda from '@aws-cdk/aws-lambda'
import { Construct, Duration, Stack, Tags } from '@aws-cdk/core'
import { createHash } from 'crypto'
import { calculateFunctionHash } from '@aws-cdk/aws-lambda/lib/function-hash'
import { AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId } from '@aws-cdk/custom-resources'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam'

export interface CdkResourceInitializerProps {
  vpc: ec2.IVpc
  subnetsSelection: ec2.SubnetSelection
  fnSecurityGroups: ec2.ISecurityGroup[]
  fnTimeout: Duration
  fnCode: lambda.DockerImageCode
  fnLogRetention: RetentionDays
  fnMemorySize?: number
  config: any
}

/**
 * this class is used to initialize the resources for the CDK app
 * it is used to create the lambda function and the custom resource
 * that will be used to initialize the resources
 * @param vpc the vpc to create the resources in
 * @param subnetsSelection the subnets to create the resources in
 * @param fnSecurityGroups the security groups to attach to the lambda function
 * @param fnTimeout the timeout for the lambda function
 * @param fnCode the docker image code for the lambda function
 * @param fnLogRetention the retention policy for the lambda function logs
 * @param fnMemorySize the memory size for the lambda function
 * @param config the configuration for the custom resource
 * @param stack the stack to create the resources in
 * @param props the properties for the custom resource
 * @param props.config the configuration for the custom resource
 * @param props.config.resourceName the name of the custom resource
 * @param props.config.resourceType the type of the custom resource
 * @param props.config.resourceProperties the properties for the custom resource
 */
export class CdkResourceInitializer extends Construct {
  public readonly response: string
  public readonly customResource: AwsCustomResource
  public readonly function: lambda.Function

  constructor (scope: Construct, id: string, props: CdkResourceInitializerProps) {
    super(scope, id)

    const stack = Stack.of(this)

    const fnSg = new ec2.SecurityGroup(this, 'ResourceInitializerFnSg', {
      securityGroupName: `${id}ResourceInitializerFnSg`,
      vpc: props.vpc,
      allowAllOutbound: true
    })

    const fn = new lambda.DockerImageFunction(this, 'ResourceInitializerFn', {
      memorySize: props.fnMemorySize || 128,
      functionName: `${id}-ResInit${stack.stackName}`,
      code: props.fnCode,
      vpcSubnets: props.vpc.selectSubnets(props.subnetsSelection),
      vpc: props.vpc,
      securityGroups: [fnSg, ...props.fnSecurityGroups],
      timeout: props.fnTimeout,
      logRetention: props.fnLogRetention,
      allowAllOutbound: true
    })

    const payload: string = JSON.stringify({
      params: {
        config: props.config
      }
    })

    const physicalResIdHash = createHash('md5')
      .update(calculateFunctionHash(fn) + payload)
      .digest('hex')

    const sdkCall: AwsSdkCall = {
      service: 'Lambda',
      action: 'invoke',
      parameters: {
        FunctionName: fn.functionName,
        Payload: payload
      },
      physicalResourceId: PhysicalResourceId.of(`${id}-AwsSdkCall-${physicalResIdHash}`)
    }

    const customResourceFnRole = new Role(this, 'AwsCustomResourceRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    })

    customResourceFnRole.addToPolicy(
      new PolicyStatement({
        resources: [`arn:aws:lambda:${stack.region}:${stack.account}:function:*-ResInit${stack.stackName}`],
        actions: ['lambda:InvokeFunction']
      })
    )

    this.customResource = new AwsCustomResource(this, 'AwsCustomResource', {
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
      onUpdate: sdkCall,
      timeout: Duration.minutes(10),
      role: customResourceFnRole
    })

    this.response = this.customResource.getResponseField('Payload')

    this.function = fn
  }
}
