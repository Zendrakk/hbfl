// Imports
const { SubscribeCommand } = require('@aws-sdk/client-sns')
const { sendSNSCommand: sendCommand } = require('./helpers')

// Declare local variables
const type = 'sms'
const endpoint = '18008881000'
const topicArn = 'arn:aws:sns:us-west-2:xxxxxxxxxx:hamster-topic'

async function execute () {
  try {
    const response = await createSubscription(type, topicArn, endpoint)
    console.log(response)
  } catch (err) {
    console.error('Error subscribing to topic:', err)
  }
}

function createSubscription (type, topicArn, endpoint) {
  const params = {
    Protocol: type,
    TopicArn: topicArn,
    Endpoint: endpoint
  }
  const command = new SubscribeCommand(params)
  return sendCommand(command)
}

execute()