const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs')

const dynamoDB = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})

// CRUD table with Document Client (abstraction)
const documentClient = DynamoDBDocument.from(dynamoDB)

const idSistOrig = "TOTVS12"

async function read() {
        const params = {
            TableName: "stg_invoice_aws",
            FilterExpression: "idSistOrig = :idSistOrig",
		    ExpressionAttributeValues: {
			':idSistOrig': idSistOrig
		  }
        };

        let items = [];
		let count = 0;
        return new Promise((resolve, reject) => {
            function onScan(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                    reject();
                } else {
					data.Items.forEach(function (value) {
						const content = "insert into webhook(id) values('" + value.id + "');\n";
						fs.appendFile('insert.sql', content, { flag: 'a+' }, err => {});
						console.log("ID:", value.id, " - Item: ", count);
						count = count + 1;
					});

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
	
read("")