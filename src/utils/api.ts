import axios, { AxiosError } from 'axios'
import options from './options'
import axiosRetry from 'axios-retry'
import { logError } from './logging'
import { Paper, Author, PaperConnector, PaperID } from '../types/inciteful';
import { SSPaper, SSAuthor } from '../types/semanticScholar'
import { ZoteroToken } from '../types/user';

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

function handleIncitefulErr(err: AxiosError) {
  logError(err)
}

function handleServiceErr(err: AxiosError) {
  if (err && err.response && err.response.status !== 404) {
    logError(err)
  }
}

function convertToIncitefulAuthor(ssAuthor: SSAuthor): Author {
  return {
    author_id: ssAuthor.id,
    name: ssAuthor.name,
    affiliation: ssAuthor.affiliation,
    sequence: 0
  }
}

function convertToIncitefulPaper(ssPaper: SSPaper): Paper {
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

function fixPaperID(p: Paper): Paper {
  p.id = p.id.toString()
  return p
}

function fixPaperIDs(p: Paper[]): Paper[] {
  return p.map(p => fixPaperID(p))
}

function searchSemanticScholar(query: string): Promise<Paper[]> {
  return axios
    .get(
      `https://api.semanticscholar.org/graph/v1/paper/search?fields=paperId,abstract,authors.authorId,authors.name,referenceCount,citationCount,venue,title,year&query=${encodeURIComponent(
        query
      )}`
    )
    .then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        return res.data.data
          .map((p: SSPaper) => convertToIncitefulPaper(p))
          .filter((p: Paper) => p.num_cited_by > 0 || p.num_citing > 0)
      } else {
        return Promise.reject()
      }
    })
    .catch(err => {
      handleServiceErr(err)
      return Promise.reject()
    })
}

// Inciteful API Calls

function queryGraphSingle(
  id: PaperID,
  sql: string,
  prune: number
): Promise<any[][]> {
  let url = `${API_URL}/query/${id}`

  if (prune) {
    url = url + `?${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraphMulti(
  ids: Array<PaperID>,
  sql: string,
  prune: number
): Promise<any[][]> {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')
  let url = `${API_URL}/query?${idParams}`

  if (prune) {
    url = url + `&${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraph(ids: Array<PaperID>, sql: string): Promise<any[][]> {
  const prune = options.getPruneLevel() || 10000

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

function connectPapers(
  from: PaperID,
  to: PaperID,
  extendedGraphs: boolean
): Promise<PaperConnector | undefined> {
  return axios
    .get(
      `${API_URL}/connector?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}&extend=${extendedGraphs ? 5 : 0}`
    )
    .then(response => {
      const data = response.data as PaperConnector
      data.papers = fixPaperIDs(data.papers)
      data.paths = data.paths.map(p => p.map(id => id.toString()))
      data.connections.forEach(p => {
        p.cited = p.cited.toString()
        p.citing = p.citing.toString()
      })
      return data
    })
    .catch(err => {
      handleIncitefulErr(err)
      return undefined
    })
}

function getPaper(id: PaperID): Promise<Paper | undefined> {
  return axios
    .get(`${API_URL}/paper/${id}`)
    .then(response => fixPaperID(response.data))
    .catch((err: AxiosError) => {
      if (axios.isAxiosError(err)) {
        const aerr = err as AxiosError

        if (aerr.response?.status != 400 && aerr.response?.status != 404) {
          handleIncitefulErr(err)
        }
      }
      return undefined
    })
}

function getZoteroAuthUrl(): Promise<string | undefined> {
  return axios
    .get(`${API_URL}/zotero/auth/initiate`)
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
      return undefined
    })
}

function getZoteroAuth(oauthToken: string): Promise<ZoteroToken | undefined> {
  return axios
    .get(`${API_URL}/zotero/auth/fetch?oauth_token=${oauthToken}`)
    .then(response => response.data)
    .catch(err => {
      handleIncitefulErr(err)
      return undefined
    })
}

function getPapers(ids: Array<PaperID>, condensed: boolean): Promise<Paper[]> {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  return axios
    .get(`${API_URL}/paper?${idParams}&condensed=${!!condensed}`)
    .then(response => fixPaperIDs(response.data as Paper[]))
    .catch(err => {
      handleIncitefulErr(err)
      return []
    })
}

function getPaperIds(ids: Array<PaperID>): Promise<PaperID[]> {
  if (ids.length == 1) {
    return getPaper(ids[0]).then(data => {
      if (data) {
        return [data.id]
      } else {
        return []
      }
    })
  } else {
    return getPapers(ids, true).then(data => {
      return data.map(p => p.id)
    })
  }
}

function searchPapers(query: string): Promise<Paper[]> {
  if (query) {
    const incitefulSearch = searchInciteful(query)
    const ssSearch = searchSemanticScholar(query)

    return Promise.any([incitefulSearch, ssSearch])
      .then(data => data)
      .catch(err => {
        handleIncitefulErr(err)
        return Promise.resolve([])
      })
  } else {
    return Promise.resolve([])
  }
}


function searchInciteful(query: string): Promise<Paper[]> {
  if (query) {
    const params = new URLSearchParams([['q', query]])
    return axios
      .get(`${API_URL}/paper/search`, {
        params,
        timeout: 1000
      })
      .then(response => {
        if (response.data.length > 0) {
          return fixPaperIDs(response.data)
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {
        return Promise.reject()
      })
  } else {
    return Promise.resolve([])
  }
}


function getCitations(ids: Array<string>): Promise<PaperID[]> {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  return axios
    .get(`${API_URL}/graph/citations?${idParams}`)
    .then(response => response.data.map((p: PaperID) => p.toString()))
    .catch(err => {
      handleIncitefulErr(err)
      return []
    })
}

function downloadBibFile(ids: Array<string>) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  window.location.href = `${API_URL}/bib?${idParams}`
}

function downloadRisFile(ids: Array<string>) {
  const idParams = ids.map(id => `${idParamName}=${id}`).join('&')

  window.location.href = `${API_URL}/ris?${idParams}`
}

function unpaywall(doi: string) {
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
  getZoteroAuthUrl,
  getZoteroAuth,
  searchPapers,
  downloadBibFile,
  downloadRisFile,
  getCitations
}
