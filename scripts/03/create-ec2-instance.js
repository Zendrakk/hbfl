// Imports
const { 
  EC2Client, 
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand
} = require('@aws-sdk/client-ec2')
const helpers = require('./helpers')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
async function execute () {
  try {
    await createSecurityGroup(sgName)
    const keyPair = await createKeyPair(keyName)
    await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

// Create functions
async function createSecurityGroup (sgName) {
  const sgParams = {
    Description: sgName,
    GroupName: sgName
  }
  const createCommand = new CreateSecurityGroupCommand(sgParams)
  const data = await sendCommand(createCommand)

  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [
      {
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      },
      {
        IpProtocol: 'tcp',
        FromPort: 3000,
        ToPort: 3000,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }]
      }
    ]
  }
  const authCommand = new AuthorizeSecurityGroupIngressCommand(rulesParams)
  return sendCommand(authCommand)
}

async function createKeyPair (keyName) {
  const params = {
    KeyName: keyName
  }
  const command = new CreateKeyPairCommand(params)
  return sendCommand(command)
}

async function createInstance (sgName, keyName) {
  const params = {
    ImageId: 'ami-02d5619017b3e5162',
    InstanceType: 't2.micro',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [ sgName ],
    IamInstanceProfile: {
      Arn: 'arn:aws:iam::xxxxxxxxxxxx:instance-profile/hamsterLTRole_profile'
    },
    UserData: 'IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xNi54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KY2QgaG9tZS9lYzItdXNlcg0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9aZW5kcmFray9oYmZsLmdpdA0KY2QgaGJmbA0KbnBtIGkNCm5wbSBydW4gc3RhcnQ='
  }
  const command = new RunInstancesCommand(params)
  return sendCommand(command)
}
