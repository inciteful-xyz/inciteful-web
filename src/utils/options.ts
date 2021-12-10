const pruneKey = 'pruneLevel'

function getPruneLevel () {
  const val = parseInt(localStorage[pruneKey])
  return val || 10000
}

function setPruneLevel (val: number) {
  if (val) {
    localStorage.setItem(pruneKey, val.toString())
  } else {
    localStorage.removeItem(pruneKey)
  }
}

export default {
  getPruneLevel,
  setPruneLevel
}
