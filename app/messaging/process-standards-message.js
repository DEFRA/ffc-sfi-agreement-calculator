const { getCachedResponse, setCachedResponse } = require('../cache')
const getStandards = require('../standards')
const config = require('../config')
const sendMessage = require('./send-message')

const processStandardsMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body

    const cachedResponse = await getCachedResponse(config.cacheConfig.standardsCache, body, correlationId)
    const standards = cachedResponse ?? { standards: await getStandards(organisationId, sbi, callerId) }

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.standardsCache, correlationId, body, standards)
    }

    await sendMessage(standards, 'uk.gov.sfi.agreement.standards.request.response', config.standardsResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process standards request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
