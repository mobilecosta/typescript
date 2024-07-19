import { Key } from "aws-sdk/clients/dynamodb"
import fs from "fs"

import { tableName } from "../src/DTOs/invoice-aws.ts"
import { documentClient } from "../src/shared/db"

const getAllAppSumoCodeIds = async () => {
  const ids: string[] = []

  const recursiveProcess = async (lastEvaluatedKey?: Key) => {
    const { Items = [], LastEvaluatedKey } = await documentClient
      .scan({
        TableName: tableName.appSumoCodes,
        ExclusiveStartKey: lastEvaluatedKey,
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ProjectionExpression: "#id",
      })
      .promise()

    ids.push(...Items.map((item) => item.id))

    if (LastEvaluatedKey) {
      await recursiveProcess(LastEvaluatedKey)
    }
  }