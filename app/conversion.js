const convertToInteger = (value) => {
  const currencyArray = value.toString().split('.')
  const integer = currencyArray[0]
  const decimal = (currencyArray[1] || '00').padEnd(2, '0').substring(0, 2)
  return Number(integer + decimal)
}

const convertToDecimal = (value) => {
  return (value / 100).toFixed(2)
}

const convertMetresToHectares = (area) => {
  const metres = convertToInteger(area)
  return Math.ceil(metres / 10000)
}

module.exports = {
  convertToInteger,
  convertToDecimal,
  convertMetresToHectares
}
