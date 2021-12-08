const pruneKey = 'pruneLevel'

function getPruneLevel () {
  const val = parseInt(localStorage[pruneKey])
  return val || 10000
}

function setPruneLevel (val: string) {
  const i = Number(val)
  if (i) {
    localStorage.setItem(pruneKey, i.toString())
  } else {
    localStorage.removeItem(pruneKey)
  }
}

export default {
  getPruneLevel,
  setPruneLevel
}
