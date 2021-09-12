const { checkSFI } = require('./sfi')
const { checkSSSI } = require('./sssi')
const { checkHEFER } = require('./hefer')
const { getCountrysideStewardshipClaim } = require('./countryside-stewardship')
const { getEnvironmentalStewardshipClaim } = require('./environmental-stewardship')
const getAllStandards = require('./get-all-standards')

const calculateStandards = async (parcels) => {
  const standards = await getAllStandards()

  for (const parcel of parcels) {
    const infos = parcel.info

    for (const standard of standards) {
      let area = 0

      // Sum the parcel area eligible for this standard
      for (const info of infos) {
        if (info.area > 0 && standard.landCoverCodes.includes(info.code)) {
          area += info.area
        }
      }

      // If there is area within the parcel, apply the -ve adjustments (CS/ES)
      // and then, if there is still parcel area remaining, apply the various
      // status flags (HEFER/SSSI/SFI) and add the parcel to the current standard.
      if (area > 0) {
        // Apply adjustments
        const csClaimArea = getCountrysideStewardshipClaim(parcel.id, standard.code)
        if (csClaimArea > 0) area -= csClaimArea

        const esClaimArea = getEnvironmentalStewardshipClaim(parcel.id, standard.code)
        if (esClaimArea > 0) area -= esClaimArea

        if (area > 0) {
          const warnings = []

          // Apply status flags
          const sssiStatus = checkSSSI(parcel.id)
          if (sssiStatus) warnings.push({ SSSI: true })

          const heferStatus = checkHEFER(parcel.id)
          if (heferStatus) warnings.push({ HEFER: true })

          const sfiStatus = checkSFI(parcel.id)
          if (sfiStatus) warnings.push({ SFI: true })

          // Add the parcel with the adjusted area to the standard
          standard.parcels.push({
            id: parcel.id,
            area,
            warnings
          })
        }
      }
    }
  }

  return standards
}

module.exports = calculateStandards