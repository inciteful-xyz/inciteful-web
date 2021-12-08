function getPaperUrl (id: string) {
  return `/p/${id}`
}
function getPaperQueryUrl (id: string) {
  return `/p/q/${id}`
}

export default {
  getPaperUrl,
  getPaperQueryUrl
}
