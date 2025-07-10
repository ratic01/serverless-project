"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessProjectStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const sqs = require("aws-cdk-lib/aws-sqs");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
class ServerlessProjectStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        const uploadLambda = new aws_lambda_nodejs_1.NodejsFunction(this, 'UploadHandler', {
            entry: path.join(__dirname, '../../lambdas/uploadHandler/index.ts'),
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
exports.ServerlessProjectStack = ServerlessProjectStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy1wcm9qZWN0LXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVybGVzcy1wcm9qZWN0LXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQyx5Q0FBeUM7QUFDekMscURBQXFEO0FBQ3JELDJDQUEyQztBQUMzQyxpREFBaUQ7QUFDakQseURBQXlEO0FBQ3pELDZCQUE2QjtBQUM3QixxRUFBK0Q7QUFFL0QsTUFBYSxzQkFBd0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNwRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQy9DLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNyRSxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDN0MsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzVDLGVBQWUsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDN0QsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNDQUFzQyxDQUFDO1lBQ25FLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDM0IsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRO2FBQzFCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUMzRCxXQUFXLEVBQUUsb0JBQW9CO1NBQ2xDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBeENELHdEQXdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTm9kZWpzRnVuY3Rpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJsZXNzUHJvamVjdFN0YWNrICBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0ZpbGVCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnRmlsZVRhYmxlJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdmaWxlSWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0ZpbGVRdWV1ZScsIHtcbiAgICAgIHZpc2liaWxpdHlUaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMDApLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBjZGsuRHVyYXRpb24uZGF5cygxKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVwbG9hZExhbWJkYSA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnVXBsb2FkSGFuZGxlcicsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbGFtYmRhcy91cGxvYWRIYW5kbGVyL2luZGV4LnRzJyksXG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgUVVFVUVfVVJMOiBxdWV1ZS5xdWV1ZVVybCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0YWJsZS5ncmFudFdyaXRlRGF0YSh1cGxvYWRMYW1iZGEpO1xuICAgIHF1ZXVlLmdyYW50U2VuZE1lc3NhZ2VzKHVwbG9hZExhbWJkYSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdGaWxlQ29udmVydGVyQXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICdGaWxlIENvbnZlcnRlciBBUEknLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXBsb2FkID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3VwbG9hZCcpO1xuICAgIHVwbG9hZC5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbih1cGxvYWRMYW1iZGEpKTtcbiAgfVxufVxuIl19