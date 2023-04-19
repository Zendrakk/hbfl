const {
  DynamoDBClient
} = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb')

async function sendCommand (command) {
  const client = new DynamoDBClient({ region: process.env.AWS_REGION })
  const docClient = DynamoDBDocumentClient.from(client)
  return docClient.send(command)
}

async function getAll (tableName) {
  const params = {
    TableName: tableName
  }
  try {
    const command = new ScanCommand(params)
    const response = await sendCommand(command)
    return response.Items  // Returns array of result(s)
  } catch (error) {
    console.error(error)
    console.log(error)
  }
}

async function get (tableName, id) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'id = :hkey',  // colon in front means it's a variable
    ExpressionAttributeValues: {
      ':hkey': +id  // Plus sign used to convert to number incase it's passedin  as a string
    }
  }
  try {
    const command = new QueryCommand(params)
    const response = await sendCommand(command)
    return response.Items[0]  // only return one item from the returned array
  } catch (error) {
    console.error(error)
    console.log(error)
  }
}

async function put (tableName, item) {
  const params = {
    TableName: tableName,
    Item: item
  }
  try {
    const command = new PutCommand(params)
    return sendCommand(command)
  } catch (error) {
    console.error(error)
    console.log(error)
  }
}

module.exports = {
  get,
  getAll,
  put
}
