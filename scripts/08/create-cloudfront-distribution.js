// Imports
const { CreateDistributionCommand } = require('@aws-sdk/client-cloudfront')
const {
  defaultCacheBehavior,
  origins
} = require('./cloudfront-parameters')
const { sendCloudFrontCommand: sendCommand } = require('./helpers')

const bucketName = 'hamster-bucket-cliff-tutorial-1'

async function execute () {
  try {
    const response = await createDistribution(bucketName)
    console.log(response)
  } catch (err) {
    console.error('Error creating distribution:', err)
  }
}

async function createDistribution (bucketName) {
  const params = {
    DistributionConfig: {
      CallerReference: `${Date.now()}`,
      Comment: 'HBFL Distribution',
      DefaultCacheBehavior: defaultCacheBehavior(bucketName),
      Origins: origins(bucketName),
      HttpVersion: 'http2',
      PriceClass: 'PriceClass_100',  // Cheapest, and only US, Canada, & Europe
      IsIPV6Enabled: true,
      Enabled: true
    }
  }
  const command = new CreateDistributionCommand(params)
  return sendCommand(command)
}

execute()