// Imports
const { CreateTopicCommand } = require('@aws-sdk/client-sns')
const { sendSNSCommand: sendCommand } = require('./helpers')

// Declare local variables
const topicName = 'hamster-topic'

async function execute () {
  try {
    const response = await createTopic(topicName)
    console.log(response)
  } catch (err) {
    console.error('Error creating new topic:', err)
  }
}

function createTopic (topicName) {
  const params = {
    Name: topicName
  }
  const command = new CreateTopicCommand(params)
  return sendCommand(command)
}

execute()