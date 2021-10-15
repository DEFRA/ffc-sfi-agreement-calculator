const saveAgreement = require('../submit')

const processSubmitMessage = async (message, receiver) => {
  try {
    await saveAgreement(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process submit message:', err)
  }
}

module.exports = processSubmitMessage
