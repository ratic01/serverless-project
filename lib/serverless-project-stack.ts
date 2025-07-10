import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class ServerlessProjectStack  extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FileBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'fileId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const queue = new sqs.Queue(this, 'FileQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      retentionPeriod: cdk.Duration.days(1),
    });

    const uploadLambda = new NodejsFunction(this, 'UploadHandler', {
      entry: path.join(__dirname, '../lambdas/uploadHandler/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: table.tableName,
        QUEUE_URL: queue.queueUrl,
      },
    });

    table.grantWriteData(uploadLambda);
    queue.grantSendMessages(uploadLambda);

    const api = new apigateway.RestApi(this, 'FileConverterApi', {
      restApiName: 'File Converter API',
    });

    const upload = api.root.addResource('upload');
    upload.addMethod('POST', new apigateway.LambdaIntegration(uploadLambda));
  }
}
