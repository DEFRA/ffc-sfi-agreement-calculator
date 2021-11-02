const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const parcelContainer = blobServiceClient.getContainerClient(config.parcelContainer)
const parcelSpatialContainer = blobServiceClient.getContainerClient(config.parcelSpatialContainer)
const parcelStandardContainer = blobServiceClient.getContainerClient(config.parcelStandardContainer)
const standardContainer = blobServiceClient.getContainerClient(config.standardContainer)

const initialiseContainers = async () => {
  await parcelContainer.createIfNotExists()
  await parcelSpatialContainer.createIfNotExists()
  await parcelStandardContainer.createIfNotExists()
  await standardContainer.createIfNotExists()
  containersInitialised = true
}

const getBlob = async (container, filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

const getFileList = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  for await (const item of parcelContainer.listBlobsFlat()) {
    fileList.push(item.name)
  }

  return fileList
}

const downloadParcelFile = async (filename) => {
  const blob = await getBlob(parcelContainer, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const downloadParcelSpatialFile = async (filename) => {
  const blob = await getBlob(parcelSpatialContainer, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const downloadParcelStandardFile = async (filename) => {
  const blob = await getBlob(parcelStandardContainer, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const downloadStandardFile = async (filename) => {
  const blob = await getBlob(standardContainer, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const getParcelBlobClient = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return parcelContainer.getBlockBlobClient(filename)
}

const getParcelSpatialBlobClient = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return parcelSpatialContainer.getBlockBlobClient(filename)
}

const getParcelStandardBlobClient = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return parcelStandardContainer.getBlockBlobClient(filename)
}

const getStandardBlobClient = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return standardContainer.getBlockBlobClient(filename)
}

module.exports = {
  getFileList,
  downloadParcelFile,
  downloadParcelSpatialFile,
  downloadParcelStandardFile,
  downloadStandardFile,
  blobServiceClient,
  getParcelBlobClient,
  getParcelSpatialBlobClient,
  getParcelStandardBlobClient,
  getStandardBlobClient
}
