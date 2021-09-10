const hoek = require('@hapi/hoek')
const config = require('../config').cacheConfig
const { createClient } = require('redis')
let client

const start = async () => {
  client = createClient({ socket: config.socket })
  await client.connect()
}

const get = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const set = async (cache, key, value) => {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue)
  await client.expire(fullKey, config.ttl)
}

const update = async (cache, key, cacheData) => {
  const existing = await get(cache, key)
  hoek.merge(existing, cacheData, { mergeArrays: false })
  await set(cache, key, existing)
}

const clear = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  await client.del(fullKey)
}

const getFullKey = (cache, key) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

const getKeyPrefix = (cache) => {
  return `${config.partition}:${cache}`
}

module.exports = {
  start,
  get,
  set,
  update,
  clear
}
