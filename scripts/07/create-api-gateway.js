// Imports
const {
  CreateResourceCommand,
  CreateRestApiCommand,
  GetResourcesCommand,
  PutIntegrationCommand,
  PutMethodCommand
} = require('@aws-sdk/client-api-gateway')
const { sendAPIGatewayCommand: sendCommand } = require('./helpers')

// Declare local variables
const apiName = 'hamster-api'

async function execute () {
  try {
    const response = await createRestApi(apiName)
    const apiData = response

    const rootResourceId = await getRootResource(apiData)

    const hbflResourceId = await createResource(rootResourceId, 'hbfl', apiData)
    await createResourceMethod(hbflResourceId, 'GET', apiData)
    await createMethodIntegration(hbflResourceId, 'GET', apiData)

    const proxyResourceId = await createResource(hbflResourceId, '{proxy+}', apiData)
    await createResourceMethod(proxyResourceId, 'ANY', apiData, 'proxy')
    await createMethodIntegration(proxyResourceId, 'ANY', apiData, 'proxy')

    console.log('API creation complete')
  } catch (err) {
    console.error('Error creating API Gateway API:', err)
  }
}

// NOTE: The API Gateway SDK uses camel case instead of Pascal case for param properties

async function createRestApi (apiName) {
  const params = {
    name: apiName
  }
  const command = new CreateRestApiCommand(params)
  return sendCommand(command)
}

async function getRootResource (api) {
  const params = {
    restApiId: api.id
  }
  const command = new GetResourcesCommand(params)
  const response = await sendCommand(command)
  const rootResource = response.items.find(r => r.path === '/')  // the slash identies the root resource
  return rootResource.id
}

async function createResource (parentResourceId, resourcePath, api) {
  const params = {
    parentId: parentResourceId,
    pathPart: resourcePath,
    restApiId: api.id
  }
  const command = new CreateResourceCommand(params)
  const response = await sendCommand(command)
  return response.id
}

async function createResourceMethod (resourceId, method, api, path) {
  const params = {
    authorizationType: 'NONE',  // want open to the public, so 'NONE'
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id
  }

  if (path) {
    params.requestParameters = {
      [`method.request.path.${path}`]: true  // back-ticks are used to create a string template to assign dynamically
    }
  }

  const command = new PutMethodCommand(params)
  return sendCommand(command)  // Won't actually use the return value, but doesn't hurt to just return it
}

async function createMethodIntegration (resourceId, method, api, path) {
  const params = {
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id,
    integrationHttpMethod: method,
    type: 'HTTP_PROXY',
    uri: 'http://hamsterLB-1975913547.us-west-2.elb.amazonaws.com'
  }

  if (path) {
    params.uri += `/{${path}}`
    params.requestParameters = {
      [`integration.request.path.${path}`]: `method.request.path.${path}`
    }
  }

  const command = new PutIntegrationCommand(params)
  return sendCommand(command)
}

execute()