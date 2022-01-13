const pruneKey = 'pruneLevel'

function getPruneLevel (): number | undefined {
  const val = parseInt(localStorage[pruneKey])
  return val || undefined
}

function setPruneLevel (val: number | undefined) {
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
