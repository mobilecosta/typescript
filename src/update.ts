const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs')

const dynamoDB = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})

// CRUD table with Document Client (abstraction)
const client = DynamoDBDocument.from(dynamoDB)

const idSistOrig = "TOTVS12"

async function update(fTablename, idupd) {
const paramsupd = { TableName: fTablename, 
					Key: { id: idupd },
					UpdateExpression: 'set cancelado = :cancelado',
					ExpressionAttributeValues: { ':cancelado': false } };
client.update(paramsupd);
console.log("ID:", idupd, "Update Feito");
}

async function read() {
        const params = {
            TableName: "stg_invoice_aws",
            FilterExpression: "idSistOrig = :idSistOrig and attribute_not_exists(cancelado)",
		    ExpressionAttributeValues: { ':idSistOrig': idSistOrig }
        };

 		let count = 0;
        return new Promise((resolve, reject) => {
            function onScan(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                    reject();
                } else {
					data.Items.forEach(function (value) {
						console.log("ID:", value.id, " - Item: ", count);
						update(params.TableName, value.id);

						count = count + 1;
					});

                    // continue scanning if we have more items, because
                    // scan can retrieve a maximum of 1MB of data
                    if (typeof data.LastEvaluatedKey !== "undefined") {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        client.scan(params, onScan);
                    } else {
                    }
                }
            }
            client.scan(params, onScan);
        });
    }
	
read()