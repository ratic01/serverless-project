// lambdas/uploadHandler/index.ts
import { SQS, DynamoDB } from 'aws-sdk';

const sqs = new SQS();
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);
  const { fileId, originalName, bucket, key } = body;

  await dynamodb.put({
    TableName: process.env.TABLE_NAME!,
    Item: {
      fileId,
      originalName,
      status: 'pending',
      timestamp: Date.now(),
    },
  }).promise();

  await sqs.sendMessage({
    QueueUrl: process.env.QUEUE_URL!,
    MessageBody: JSON.stringify({ fileId, bucket, key }),
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'File received and queued for processing.' }),
  };
};
