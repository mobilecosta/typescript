const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})

// CRUD table with Document Client (abstraction)
const documentClient = DynamoDBDocument.from(dynamoDB)

const idSistOrig = "TOTVS12"

async function read() {
        const params = {
            TableName: "prod_invoice_aws",
            FilterExpression: "idSistOrig = :idSistOrig",
		    ExpressionAttributeValues: {
			':idSistOrig': idSistOrig
		  }
        };

        let items = [];
        return new Promise((resolve, reject) => {
            function onScan(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                    reject();
                } else {
					console.log("ID", data.Items[0].id);

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