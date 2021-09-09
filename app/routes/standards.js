const cache = require('../cache')

module.exports = [{
  method: 'GET',
  path: '/standards',
  options: {
    handler: async (request, h) => {
      const correlationId = request.query.correlationId

      if (correlationId) {
        const cacheData = await cache.get('standards', correlationId)
        if (cacheData?.requests && cacheData.requests[cacheData.requests.length - 1]?.standards) {
          return h.response({ standards: cacheData.requests[cacheData.requests.length - 1].standards }).code(200)
        }
      }
      return h.response(`value for ${correlationId} not in cache, try later`).code(202)
    }
  }
}]
