const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const isObjectId = (param) => checkForHexRegExp.test(param)

module.exports = isObjectId