const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  socket: Joi.object({
    host: Joi.string(),
    port: Joi.number().default(6379),
    tls: Joi.boolean().default(false)
  }),
  password: Joi.string().allow(''),
  partition: Joi.string().default('ffc-sfi-agreement-calculator'),
  ttl: Joi.number().default(3600 * 1000 * 2), // 2 hours,
  standardsCache: Joi.string().default('standards'),
  calculateCache: Joi.string().default('calculate'),
  validateCache: Joi.string().default('validate'),
  eligibilityCache: Joi.string().default('eligibility'),
  parcelCache: Joi.string().default('parcel'),
  parcelSpatialCache: Joi.string().default('spatial'),
  parcelStandardCache: Joi.string().default('parcel-standard')
})

// Build config
const config = {
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    tls: process.env.NODE_ENV === 'production'
  },
  password: process.env.REDIS_PASSWORD,
  partition: process.env.REDIS_PARTITION,
  ttl: process.env.REDIS_TTL,
  standardsCache: process.env.REDIS_STANDARDS_CACHE,
  calculateCache: process.env.REDIS_CALCULATE_CACHE,
  validateCache: process.env.REDIS_VALIDATE_CACHE,
  eligibilityCache: process.env.REDIS_ELIGIBILITY_CACHE,
  parcelCache: process.env.REDIS_PARCEL_CACHE,
  parcelSpatialCache: process.env.REDIS_PARCEL_SPATIAL_CACHE,
  parcelStandardCache: process.env.REDIS_PARCEL_STANDARD_CACHE
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The cache config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

module.exports = value
