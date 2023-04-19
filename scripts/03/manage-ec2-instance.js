// Imports
const {
  EC2Client,
  DescribeInstancesCommand,
  TerminateInstancesCommand
} = require('@aws-sdk/client-ec2')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

async function listInstances () {
  const command = new DescribeInstancesCommand({})  // Still requires object as input regardless of no properties being provided
  const data = await sendCommand(command)
  return data.Reservations.reduce((i, r) => {  // i = aggregated Instances array, r = current Reversation object
    return i.concat(r.Instances)
  }, [] )  // empty array is the seed that the reduce() function requires
}

async function terminateInstance (instanceId) {
  const params = {
    InstanceIds: [ instanceId ]
  }
  const command = new TerminateInstancesCommand(params)
  return sendCommand(command)
}

listInstances().then(console.log)
//terminateInstance('i-071eeb92d7fdc84fc').then(console.log)
