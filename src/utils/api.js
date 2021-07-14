import axios from 'axios'
import urls from './urls'
import options from './options'
import axiosRetry from 'axios-retry'
import logging from './logging'

const MAX_INCITEFUL_REQUESTS = 5
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0

const queryApi = axios.create()

queryApi.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_INCITEFUL_REQUESTS) {
        PENDING_REQUESTS++
        clearInterval(interval)
        resolve(config)
      }
    }, INTERVAL_MS)
  })
})

queryApi.interceptors.response.use(
  function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.resolve(response)
  },
  function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.reject(error)
  }
)

axiosRetry(queryApi, { retries: 3 })

// function parseErr (err) {
//   if (err.response && err.response.data) {
//     return err.response.data
//   }

//   return 'Internal Server Error: Please refresh the page.'
// }

// Inciteful API Calls
function queryGraph (ids, sql) {
  const prune = options.getPruneLevel()

  if (Array.isArray(ids)) {
    if (ids.length === 1) {
      return queryGraphSingle(ids[0], sql, prune)
    } else {
      return queryGraphMulti(ids, sql, prune)
    }
  } else {
    return queryGraphSingle(ids, sql, prune)
  }
}

function queryGraphSingle (id, sql, prune) {
  let url = `${process.env.VUE_APP_CLIENT_API_URL}/query/${id}`

  if (prune) {
    url = url + `?${urls.pruneParamName}=${prune}`
  }

  return queryApi
    .post(url, sql)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function queryGraphMulti (ids, sql, prune) {
  const idParams = ids.map(id => `${urls.idParamName}=${id}`).join('&')
  let url = `${process.env.VUE_APP_CLIENT_API_URL}/query?${idParams}`

  if (prune) {
    url = url + `&${urls.pruneParamName}=${prune}`
  }

  return queryApi
    .post(url, sql)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function connectPapers (from, to, extendedGraphs) {
  return axios
    .get(
      `${
        process.env.VUE_APP_CLIENT_API_URL
      }/connector?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&extend=${extendedGraphs ? 5 : 0}`
    )
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function getPaper (id) {
  console.log(process.env.VUE_APP_CLIENT_API_URL)
  return axios
    .get(`${process.env.VUE_APP_CLIENT_API_URL}/paper/${id}`)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function getPapers (ids) {
  const idParams = ids.map(id => `${urls.idParamName}=${id}`).join('&')

  return axios
    .get(`${process.env.VUE_APP_CLIENT_API_URL}/paper?${idParams}`)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function getPaperIds (ids) {
  return getPapers(ids).then(data => {
    return Object.keys(data)
  })
}

function searchPapers (query) {
  const params = new URLSearchParams([['q', query]])
  return axios
    .get(`${process.env.VUE_APP_CLIENT_API_URL}/paper/search`, {
      params,
      timeout: 1500
    })
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function getCitations (ids) {
  const idParams = ids.map(id => `${urls.idParamName}=${id}`).join('&')

  return axios
    .get(`${process.env.VUE_APP_CLIENT_API_URL}/graph/citations?${idParams}`)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function downloadBibFile (ids) {
  const url = `${process.env.VUE_APP_CLIENT_API_URL}/bib`

  window.location = urls.constructUrlFromIdsAndParams(url, ids, [])
}

// Non Inciteful APIs
function parseMagQuery (query) {
  const terms = query
    .replace(/[^0-9a-z]/gi, ' ')
    .replace(/\s\s+/g, ' ')
    .toLowerCase()
    .trim()
    .split(' ')
  // let doi = query.replace(/[\'\s+]/gi, '').toUpperCase();

  if (terms.length) {
    const querySearch =
      'AND('.repeat(terms.length) + terms.map(x => `W='${x}')`).join(',')
    // return `OR(${querySearch}, DOI='${doi}')`;
    return querySearch
  }

  return ''
}

function parseLensQuery (query) {
  const reservedChars = [
    '+',
    '-',
    '=',
    '&&',
    '||',
    '>',
    '<',
    '!',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '^',
    '"',
    '~',
    '*',
    '"',
    '?',
    ':',
    '\\',
    '/'
  ]
  reservedChars.forEach(c => {
    query = query.replace(c, ' ')
  })

  return query
}

function searchLensPapers (query, num) {
  const n = num || 10
  const params = new URLSearchParams([
    ['q', parseLensQuery(query)],
    ['n', n]
  ])
  return axios
    .get(`${process.env.VUE_APP_CLIENT_API_URL}/paper/lens/search`, { params })
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
    })
}

function queryMag (query) {
  const config = {
    headers: {
      'Ocp-Apim-Subscription-Key': '4ce177b950b24b95b196c475978738f8'
    }
  }

  const parsedQuery = parseMagQuery(query)
  logging.logInfo('Search Box Query', {
    base: query,
    parsed: parsedQuery
  })

  return axios
    .get(
      `https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate?expr=${parsedQuery}&attributes=Id,DOI,DN,AA.DAuN,AA.DAfN,Y,BV,ECC,Ty`,
      config
    )
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
      return undefined
    })
}

function unpaywall (doi) {
  return axios
    .get(`https://api.unpaywall.org/v2/${doi}?email=info@inciteful.xyz`)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
      return undefined
    })
}

function semanticScholarMag (magid) {
  return axios
    .get(`https://api.semanticscholar.org/v1/paper/MAG:${magid}`)
    .then(response => response.data)
    .catch(err => {
      logging.logError(err)
      return undefined
    })
}

export default {
  queryGraph,
  queryMag,
  searchLensPapers,
  unpaywall,
  semanticScholarMag,
  getPaper,
  getPapers,
  connectPapers,
  getPaperIds,
  searchPapers,
  downloadBibFile,
  getCitations
}
