import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function batchWriteItems(items: any[], tableName: string) {
  const params = {
    RequestItems: {
      [tableName]: items.map((item: any) => ({
        PutRequest: {
          Item: item
        }
      }))
    }
  };
  
  try {
    const data = await dynamoDb.batchWrite(params).promise();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}