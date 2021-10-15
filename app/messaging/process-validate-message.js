const sendMessage = require('./send-message')
const config = require('../config')
const getStandards = require('../standards')
const getStandardWarnings = require('../standards/get-standard-warnings')
const { setCachedResponse, getCachedResponse } = require('../cache')

const processValidateMessage = async (message, receiver) => {
  try {
    const { body, correlationId } = message
    const { organisationId, sbi, callerId } = body

    let validationResult = await getCachedResponse(config.cacheConfig.validateCache, body, correlationId)

    if (!validationResult) {
      const standards = await getStandards(organisationId, sbi, callerId)
      validationResult = { validationResult: getStandardWarnings(standards) }
      await setCachedResponse(config.cacheConfig.validateCache, correlationId, body, validationResult)
    }

    await sendMessage(validationResult, 'uk.gov.sfi.validate.result', config.validateResponseTopic, { correlationId })

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process validate message:', err)
  }
}

module.exports = processValidateMessage
