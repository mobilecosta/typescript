const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})

// CRUD table with Document Client (abstraction)
const documentClient = DynamoDBDocument.from(dynamoDB)

// query
const startDate = "2024-07-17T00:00:00.000Z"
const endDate = "2024-07-20T00:00:00.000Z"

/**
 * REMEMBER: SCAN IS TOO COSTLY TO USE. USE QUERY INSTEAD, OTHERWISE AWS BILLING WILL GO HIGH.
 * I want to scan my table "hdr" for items that their CreatedAt are between "startDate" and "endDate". 
 */
var params = {
  TableName: "prod_invoice_aws",
  FilterExpression: "#createdAt BETWEEN :startDate and :endDate",
  ExpressionAttributeNames: {
    "#createdAt": "createdAt",
  },
  ExpressionAttributeValues: {
    ':startDate': startDate,
    ':endDate': endDate,
  }
}

async function run() {
  try {
    const data = await documentClient.scan(params)
    console.log("Success", data);
  }
  catch (err) {
    console.log("Error", err);
  }
}
run()
