const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})

// CRUD table with Document Client (abstraction)
const documentClient = DynamoDBDocument.from(dynamoDB)

async function read() {
        const params = {
            TableName: "prod_invoice_aws"
            // options can be passed here e.g.
            // FilterExpression: "#yr between :start_yr and :end_yr",
        };

        let items = [];
        return new Promise((resolve, reject) => {
            function onScan(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                    reject();
                } else {
                    items = items.concat(data.Items);

                    // continue scanning if we have more items, because
                    // scan can retrieve a maximum of 1MB of data
                    if (typeof data.LastEvaluatedKey !== "undefined") {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        documentClient.scan(params, onScan);
                    } else {
                        resolve(items);
                    }
                }
            }
            documentClient.scan(params, onScan);
        });
    }

read()	