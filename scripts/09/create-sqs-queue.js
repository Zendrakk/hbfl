// Imports
const { CreateQueueCommand } = require('@aws-sdk/client-sqs')
const { sendSQSCommand: sendCommand } = require('./helpers')

// Declare local variables
const queueName = 'hamster-race-results'

async function execute () {
  try {
    const response = await createQueue(queueName)
    console.log(response)
  } catch (err) {
    console.error('Error creating SQS queue:', err)
  }
}

function createQueue (queueName) {
  const params = {
    QueueName: queueName,
    Attributes: {
      DelaySeconds: 0,
      MessageRetentionPeriod: 345600,  // 4 days
      VisibilityTimeout: 30,  // 30 seconds
      ReceiveMessageWaitTimeSeconds: 0  // Let consumers decide if they want to long poll or not
    }
  }

  const command = new CreateQueueCommand(params)
  return sendCommand(command)
}

execute()