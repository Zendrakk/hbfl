const {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient
} = require('@aws-sdk/client-sqs')

const hamsters = require('../hamsters')

const RACE_QUEUE = 'hamster-race-results'

const client = new SQSClient({ region: process.env.AWS_REGION })

function init () {
  return Promise.resolve(setInterval(() => {
    poll()
    .then(msg => console.log(`${new Date()} - ${msg}`))
    .catch(err => console.error(`${new Date()} - ${err}`))
  }, 5000))
}

async function poll () {
  const queueParams = {
    QueueName: RACE_QUEUE
  }

  const getUrlCommand = new GetQueueUrlCommand(queueParams)
  const queueData = await client.send(getUrlCommand)

  const receiveParams = {
    QueueURL: queueData.QueueUrl,
    MaxNumberOfMessages: 10,  // Ranges between 1-10
    VisibilityTimeout: 15
  }
  const receiveCommand = new ReceiveMessageCommand(receiveParams)
  const msgData = await client.send(receiveCommand)

  if (!msgData.Messages || !msgData.Messages.length) {
    return `No messages in queue ${RACE_QUEUE}`
  } else {
    const resultsMap = groupMessagesByHamster(msgData.Messages)

    for (const key in resultsMap) {
      await putResults(key, resultsMap[key])
    }

    await deleteMsgs(msgData.Messages, queueData.QueueUrl)

    return `Processed ${msgData.Messages.length} messages from SQS`
  }
}

async function deleteMsgs (results, queueUrl) {
  for (const result of results) {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: result.ReceiptHandle
    }

    const command = new DeleteMessageCommand(params)
    await client.send(command)
  }
}

function groupMessagesByHamster (messages) {
  const hamMap = {}

  messages.map((message) => {
    const result = JSON.parse(message.Body)
    if (!hamMap[result.hamsterId]) {
      hamMap[result.hamsterId] = []
    }
    hamMap[result.hamsterId] = hamMap[result.hamsterId].concat(result)
    return result
  })

  return hamMap
}

async function putResults (hamsterId, results) {
  const hamster = await hamsters.get(hamsterId)
  if (!hamster.results) {
    hamster.results = []
  }

  hamster.results = hamster.results.concat(results)
  return hamsters.put(hamster)
}

module.exports = {
  init
}