// Imports
const { PutMetricAlarmCommand } = require('@aws-sdk/client-cloudwatch')
const { sendCloudWatchCommand: sendCommand } = require('./helpers')

// Declare local variables
const alarmName = 'hamster-elb-alarm'
const topicArn = 'arn:aws:sns:us-west-2:xxxxxxxxxx:hamster-topic'  // Entire Topic Arn
const tg = 'targetgroup/hamsterTG/71xxxxxxxxxxxx'  // Last part of Target Group
const lb = 'app/hamsterLB/4dxxxxxxxxxxxxx'  // Last part of Load Balancer

async function execute () {
  try {
    const response = await createCloudWatchAlarm(alarmName, topicArn, tg, lb)
    console.log(response)
  } catch (err) {
    console.error('Error creating CloudWatch alarm:', err)
  }
}

function createCloudWatchAlarm (alarmName, topicArn, tg, lb) {
  const params = {
    AlarmName: alarmName,
    ComparisonOperator: 'LessThanThreshold',  // Can also be GreaterThanThreshold
    EvaluationPeriods: 1,
    MetricName: 'HealthyHostCount',
    Namespace: 'AWS/ApplicationELB',
    Period: 60,  // In seconds, so 1 minute
    Threshold: 1,
    AlarmActions: [
      topicArn
    ],
    Dimensions: [
      {
        Name: 'TargetGroup',
        Value: tg
      },
      {
        Name: 'LoadBalancer',
        Value: lb
      }
    ],
    Statistic: 'Average',  // Other options are: Minimum, Maximum, Sum, SampleCount
    TreatMissingData: 'breaching'  // Other options are: ingore, not breaching, missing
  }
  const command = new PutMetricAlarmCommand(params)
  return sendCommand(command)
}

execute()