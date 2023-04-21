// Imports
const {
  RunInstancesCommand,
  StopInstancesCommand
} = require('@aws-sdk/client-ec2')
const { sendCommand } = require('./helpers')

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'
const instanceId = 'i-0xxxxxxxxxxxxxx'

async function execute () {
  try {
    await stopInstance(instanceId)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

async function createInstance (sgName, keyName) {
  const params = {
    ImageId: 'ami-02d5619017b3e5162',
    InstanceType: 't2.micro',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    Placement: {
      AvailabilityZone: 'us-west-2a'
    },
    SecurityGroups: [ sgName ]
  }
  const command = new RunInstancesCommand(params)
  return sendCommand(command)
}

function stopInstance (instanceId) {
  const params = {
    InstanceIds: [ instanceId ]
  }
  const command = new StopInstancesCommand(params)
  return sendCommand(command)
}

execute()
