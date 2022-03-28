const urlConvert = (url) => {
  if (!url) return url
  return url.replace('public', '').replaceAll('\\', '/')
}

module.exports = urlConvert