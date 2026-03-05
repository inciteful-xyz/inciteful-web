const pruneKey = 'pruneLevel'

function getPruneLevel (): number | undefined {
  try {
    const val = parseInt(localStorage[pruneKey])
    return val || undefined
  } catch {
    return undefined
  }
}

function setPruneLevel (val: number | undefined) {
  try {
    if (val) {
      localStorage.setItem(pruneKey, val.toString())
    } else {
      localStorage.removeItem(pruneKey)
    }
  } catch {
    // localStorage unavailable (e.g. restricted browser settings)
  }
}

export default {
  getPruneLevel,
  setPruneLevel
}
