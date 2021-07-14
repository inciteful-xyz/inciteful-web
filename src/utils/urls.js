const idParamName = 'ids[]'
const pruneParamName = 'prune'

function createParamString (params) {
  return params.sort().map(x => `${x[0]}=${encodeURIComponent(x[1])}`).join('&')
}

function splitIdsFromParams (searchQuery) {
  const newIds = new Set()
  const params = []

  if (searchQuery) {
    const entries = searchQuery.substring(1).split('&').map((x) => x.split('='))

    for (const param of entries) {
      if (param[0] === idParamName && param[1] && param[1].trim() !== '') {
        newIds.add(decodeURIComponent(param[1]))
      } else if (param.length === 2) {
        params.push([param[0], decodeURIComponent(param[1])])
      }
    }
  }

  return [newIds, params]
}

function constructUrlFromIdsAndParams (baseUrl, ids, params) {
  if (params === undefined) { params = [] }

  const idSet = new Set(ids)

  if (idSet.size === 1) {
    const it = idSet.values()
    const soloId = it.next().value
    let newUrl = `${baseUrl}/${soloId}`

    if (params.length) {
      newUrl = `${newUrl}?${createParamString(params)}`
    }

    return newUrl
  } else {
    idSet.forEach(x => params.push([idParamName, x]))
    return baseUrl + '?' + createParamString(params)
  }
}

function getIdFromPath (path) {
  return path.replace(/^(\/)*p*(\/q)*(\/)*/, '')
}

function getBaseUrl (path) {
  if (path.startsWith('/p/q')) {
    return '/p/q'
  }

  return '/p'
}

function addIdToUrl (id, location) {
  const baseUrl = getBaseUrl(location.pathname)
  const [ids, params] = splitIdsFromParams(location.search)
  const pathId = getIdFromPath(location.pathname)

  if (pathId) {
    ids.add(pathId)
  }

  ids.add(id)

  return constructUrlFromIdsAndParams(baseUrl, ids, params)
}

function addIdsToUrl (newIds, location, saveOtherParams) {
  const baseUrl = getBaseUrl(location.pathname)
  const [ids, params] = splitIdsFromParams(location.search)
  const pathId = getIdFromPath(location.pathname)

  if (pathId) {
    ids.add(pathId)
  }

  newIds.forEach((x) => ids.add(x))

  return constructUrlFromIdsAndParams(baseUrl, ids, saveOtherParams ? params : [])
}

function removeIdFromUrl (id, location) {
  const baseUrl = getBaseUrl(location.pathname)
  const [ids, params] = splitIdsFromParams(location.search)
  const pathId = getIdFromPath(location.pathname)

  if (pathId) {
    ids.add(pathId)
  }

  ids.delete(id.toString())

  return constructUrlFromIdsAndParams(baseUrl, ids, params)
}

function getReturnUrl (location) {
  const [, params] = splitIdsFromParams(location.search)

  for (const param of params) {
    if (param[0] === 'returnUrl') {
      return param[1]
    }
  }

  return undefined
}

export default {
  removeIdFromUrl,
  addIdToUrl,
  addIdsToUrl,
  idParamName,
  pruneParamName,
  constructUrlFromIdsAndParams,
  getReturnUrl
}
