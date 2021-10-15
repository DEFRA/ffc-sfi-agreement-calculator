const { getCachedResponse, setCachedResponse } = require('../cache')
const calculatePaymentRates = require('../calculate')
const config = require('../config')
const sendMessage = require('./send-message')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { code, parcels, calculateDate } = body

    const cachedResponse = await getCachedResponse(config.cacheConfig.calculateCache, body, correlationId)
    const paymentRates = cachedResponse ?? await calculatePaymentRates(code, parcels, calculateDate)

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.calculateCache, correlationId, body, paymentRates)
    }

    await sendMessage(paymentRates, 'uk.gov.sfi.agreement.calculate.response', config.calculateResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process calculate message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
