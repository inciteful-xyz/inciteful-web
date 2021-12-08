/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosError } from 'axios'
import options from './options'
import axiosRetry from 'axios-retry'
import { logError } from './logging'
import { Paper, Author, SSPaper, SSAuthor } from '../shim-types'

const MAX_INCITEFUL_REQUESTS = 100
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0
const idParamName = 'ids[]'
const pruneParamName = 'prune'
const queryApi = axios.create()
const API_URL =
  process.env.VUE_APP_CLIENT_API_URL || 'https://api.inciteful.xyz'

queryApi.interceptors.request.use(function (config) {
  return new Promise(resolve => {
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

function handleIncitefulErr (err: AxiosError) {
  logError(err)
}

function handleServiceErr (err: AxiosError) {
  if (err.response && err.response.status !== 404) {
    logError(err)
  }
}

function convertToIncitefulAuthor (ssAuthor: SSAuthor): Author {
  return {
    author_id: ssAuthor.id,
    name: ssAuthor.name,
    affiliation: ssAuthor.affiliation,
    sequence: 0
  }
}

function convertToIncitefulPaper (ssPaper: SSPaper): Paper {
  return {
    id: `s2id:${ssPaper.paperId}`,
    title: ssPaper.title,
    author: ssPaper.authors.map(convertToIncitefulAuthor),
    published_year: parseInt(ssPaper.year),
    journal: ssPaper.venue,
    abstract: ssPaper.abstract,
    num_cited_by: ssPaper.citationCount,
    num_citing: ssPaper.referenceCount,
    doi: '',
    pages: '',
    volume: ''
  }
}

function searchSemanticScholar (query: string) {
  return axios
    .get(
      `https://api.semanticscholar.org/graph/v1/paper/search?fields=paperId,abstract,authors.authorId,authors.name,referenceCount,citationCount,venue,title,year&query=${encodeURIComponent(
        query
      )}`
    )
    .then(res => {
      if (res.data && res.data.data) {
        res.data.data.forEach((p: SSPaper) => {
          convertToIncitefulPaper(p)
        })
        return res.data.data
      } else {
        return []
      }
    })
    .catch(err => {
      handleServiceErr(err)
      return Promise.resolve([])
    })
}

// Inciteful API Calls

function queryGraphSingle (id: string, sql: string, prune: number) {
  let url = `${API_URL}/query/${id}`

  if (prune) {
    url = url + `?${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraphMulti (ids: Array<string>, sql: string, prune: number) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')
  let url = `${API_URL}/query?${idParams}`

  if (prune) {
    url = url + `&${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraph (ids: Array<string>, sql: string) {
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

function connectPapers (from: string, to: string, extendedGraphs: number) {
  return axios
    .get(
      `${API_URL}/connector?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}&extend=${extendedGraphs ? 5 : 0}`
    )
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
    })
}

function getPaper (id: string) {
  return axios
    .get(`${API_URL}/paper/${id}`)
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
    })
}

function getPapers (ids: Array<string>, condensed: boolean) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  return axios
    .get(`${API_URL}/paper?${idParams}&condensed=${!!condensed}`)
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
    })
}

function getPaperIds (ids: Array<string>) {
  return getPapers(ids, true).then(data =>
    data.map((paper: { id: string }) => paper.id)
  )
}

function searchPapers (query: string) {
  if (query) {
    const params = new URLSearchParams([['q', query]])
    return axios
      .get(`${API_URL}/paper/search`, {
        params,
        timeout: 1000
      })
      .then(response => response.data)
      .catch(() => {
        return []
      })
      .then(data => {
        if (data.length > 0) {
          return data
        } else {
          return searchSemanticScholar(query).then(data => data)
        }
      })
  } else {
    return Promise.resolve([])
  }
}

function getCitations (ids: Array<string>) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  return axios
    .get(`${API_URL}/graph/citations?${idParams}`)
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
    })
}

function downloadBibFile (ids: Array<string>) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  window.location.href = `${API_URL}/bib?${idParams}`
}

function unpaywall (doi: string) {
  return axios
    .get(`https://api.unpaywall.org/v2/${doi}?email=info@inciteful.xyz`)
    .then(response => response.data)
    .catch(err => {
      handleServiceErr(err)
      return undefined
    })
}

export default {
  queryGraph,
  unpaywall,
  searchSemanticScholar,
  getPaper,
  getPapers,
  connectPapers,
  getPaperIds,
  searchPapers,
  downloadBibFile,
  getCitations
}
