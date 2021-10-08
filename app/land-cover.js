const { get } = require('./api')
const { convertMetresToHectares } = require('./conversion')

const getLandCover = async (organisationId, callerId) => {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const getLandCoverArea = async (organisationId, callerId) => {
  const landCover = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)

  const totalArea = landCover.reduce((allTotal, parcel) => {
    const sum = parcel.info.reduce((total, parcelInfo) => {
      const area = parcelInfo.code !== '000' ? parcelInfo.area : 0
      return total + convertMetresToHectares(area)
    }, 0)
    return allTotal + sum
  }, 0)

  return totalArea
}

module.exports = {
  getLandCover,
  getLandCoverArea
}
