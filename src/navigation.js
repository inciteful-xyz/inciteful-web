function getPaperUrl (id) {
  return `/p/${id}`
}
function getPaperQueryUrl (id) {
  return `/p/q/${id}`
}

export default {
  getPaperUrl,
  getPaperQueryUrl
}
