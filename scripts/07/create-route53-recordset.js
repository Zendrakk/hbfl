// Imports
const {
  ChangeResourceRecordSetsCommand
} = require('@aws-sdk/client-route-53')
const { sendRoute53Command: sendCommand } = require('./helpers')

// Declare local variables
const hzId = '/hostedzone/Z00060171CPxxxxxxxxxx'

async function execute () {
  try {
    const response = await createRecordSet(hzId)
    console.log(response)
  } catch (err) {
    console.error('Error creating record set:', err)
  }
}

async function createRecordSet (hzId) {
  const params = {
    HostedZoneId: hzId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'hbfl.online',
            Type: 'A',
            AliasTarget: {
              DNSName: 'hamsterLB-xxxxxxxxxx.us-west-2.elb.amazonaws.com',
              EvaluateTargetHealth: false,
              HostedZoneId: 'Z1Hxxxxxxxxxx'
            }
          }
        }
      ]
    }
  }
  const command = new ChangeResourceRecordSetsCommand(params)
  return sendCommand(command)

  // Link to ELB Regions:
  // https://docs.aws.amazon.com/general/latest/gr/elb.html
}

execute()