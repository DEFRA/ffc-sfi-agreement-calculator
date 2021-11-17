const { convertToDecimal } = require('../conversion')
const { runLandCoverRules, runParcelRules } = require('../rules-engine/sets/parcel')
const standards = require('./funding-options')

const calculateStandards = async (sbi, parcels) => {
  for (const parcel of parcels) {
    for (const standard of standards) {
      standard.parcels = []
      const parcelResult = await runParcelRules({ code: standard.code, sbi, ...parcel })
      if (!parcelResult.failureEvents.length) {
        const landCovers = getGroupedLandCovers(parcel.info)
        for (const landCover of landCovers) {
          const landCoverResult = await runLandCoverRules({ code: standard.code, sbi, ...parcel })
          if (!landCoverResult.failureEvents.length) {
            standard.parcels.push({
              id: parcel.id,
              area: convertToDecimal(landCover.area)
            })
          }
        }
      }
    }
  }

  return standards
}

const getGroupedLandCovers = (infos) => {
  return [...infos.reduce((x, y) => {
    const key = y.code

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { code: y.code, area: 0 })
    item.area += Number(y.area)

    return x.set(key, item)
  }, new Map()).values()]
}

module.exports = calculateStandards
