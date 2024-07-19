const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = 'myTable';
const item = { id: '123', name: 'John' };

const params = {
    TableName: tableName,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)',
};

dynamoDb.put(params).promise()
    .then(() => {
        console.log(Item ${item.id} created successfully );
    })
    .catch(err => {
        if (err.code === 'ConditionalCheckFailedException') {
            console.log(Item ${item.id} already exists );
        } else {
            console.error(err);
        }
    });