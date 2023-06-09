// Imports
const {
  CreateAutoScalingGroupCommand,
  PutScalingPolicyCommand
} = require('@aws-sdk/client-auto-scaling')

const { sendAutoScalingCommand } = require('./helpers')

// Declare local variables
const asgName = 'hamsterASG'
const ltName = 'hamsterLT'
const policyName = 'hamsterPolicy'
const tgArn = 'arn:aws:elasticloadbalancing:us-west-2:xxxxxxxxxxxx:targetgroup/hamsterTG/xxxxxxxxxxxxxx'

async function execute () {
  try {
    const response = await createAutoScalingGroup(asgName, ltName)
    await createASGPolicy(asgName, policyName)
    console.log('Created auto scaling group with:', response)
  } catch (err) {
    console.error('Failed to create auto scaling group with:', err)
  }
}

function createAutoScalingGroup (asgName, ltName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: [
      'us-west-2a',
      'us-west-2b'
    ],
    LaunchTemplate: {
      LaunchTemplateName: ltName
    },
    MaxSize: 2,
    MinSize: 1,
    TargetGroupARNs: [ tgArn ]
  }
  const command = new CreateAutoScalingGroupCommand(params)
  return sendAutoScalingCommand(command)
}

function createASGPolicy (asgName, policyName) {
  const params = {
    AdjustmentType: 'ChangeInCapacity',
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      }
    }
  }
  const command = new PutScalingPolicyCommand(params)
  return sendAutoScalingCommand(command)
}

execute()