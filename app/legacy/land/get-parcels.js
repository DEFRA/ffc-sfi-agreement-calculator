const { get } = require('../../api')
const { convertMetresToHectares } = require('../../conversion')
const config = require('../../config')
const { get: getCache, update } = require('../../cache')

const getParcels = async (organisationId, crn, token) => {
  const cachedParcels = await getCache(config.cacheConfig.parcelCache, organisationId)
  if (cachedParcels.parcels) {
    return cachedParcels.parcels
  }
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, crn, token) ?? []
  if (parcels.length) {
    parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  }
  await update(config.cacheConfig.parcelCache, organisationId, { parcels })
  return parcels
}

module.exports = getParcels
