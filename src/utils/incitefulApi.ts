import axios, { AxiosError, AxiosResponse } from 'axios'
import options from './options'
import axiosRetry from 'axios-retry'
import { logError } from './logging'
import { Paper, PaperConnector, PaperID, PaperAutosuggest, paperIntoPaperAutosuggest, QueryResults } from '../types/incitefulTypes';
import { searchOAAutocomplete } from './openalexApi';

const MAX_INCITEFUL_REQUESTS = 100
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0
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

function buildIDParams(ids: string[]) {
  const idParamName = 'ids[]'

  const id_set = new Set<PaperID>();

  if (ids && ids.length > 0)
    ids.forEach(x => id_set.add(x));

  const idParams = Array.from(id_set).map(id => `${idParamName}=${encodeURIComponent(id)}`).join('&');
  return idParams;
}

function fixPaperID(p: Paper): Paper {
  p.id = p.id.toString()
  return p
}

function fixPaperIDs(p: Paper[]): Paper[] {
  return p.map(p => fixPaperID(p))
}

// Inciteful API Calls

function queryGraphSingle(
  id: PaperID,
  sql: string,
  prune: number
): Promise<QueryResults> {
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
): Promise<QueryResults> {
  let url = `${API_URL}/query?${buildIDParams(ids)}`

  if (prune) {
    url = url + `&${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraph(ids: Array<PaperID>, sql: string): Promise<QueryResults> {
  const prune = options.getPruneLevel() || 10000

  let response: Promise<QueryResults>

  if (Array.isArray(ids)) {
    if (ids.length === 1) {
      response = queryGraphSingle(ids[0], sql, prune)
    } else {
      response = queryGraphMulti(ids, sql, prune)
    }
  } else {
    response = queryGraphSingle(ids, sql, prune)
  }

  return response.catch(err => {
    handleIncitefulErr(err)
    return Promise.reject(err.response.data)
  })
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
    .then((response: AxiosResponse<PaperConnector>) => {
      const data = response.data;
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
    .then((response: AxiosResponse<Paper>) => fixPaperID(response.data))
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

function getPapers(ids: Array<PaperID>, condensed: boolean): Promise<Paper[]> {
  const idParams = buildIDParams(ids)

  return axios
    .get(`${API_URL}/paper?${idParams}&condensed=${!!condensed}`)
    .then((response: AxiosResponse<Paper[]>) => fixPaperIDs(response.data))
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

function autosuggestSearch(query: string): Promise<PaperAutosuggest[]> {
  if (query) {
    const incitefulSearch = searchInciteful(query)
    const oaSearch = searchOAAutocomplete(query)

    return Promise.any([incitefulSearch, oaSearch])
      .then(data => data)
      .catch(err => {
        handleIncitefulErr(err)
        return Promise.resolve([])
      })
  } else {
    return Promise.resolve([])
  }
}


function searchInciteful(query: string): Promise<PaperAutosuggest[]> {
  if (query) {
    const params = new URLSearchParams([['q', query]])
    return axios
      .get(`${API_URL}/paper/search`, {
        params,
        timeout: 1000
      })
      .then((response: AxiosResponse<Paper[]>) => {
        if (response.data.length > 0) {
          return fixPaperIDs(response.data).map(paperIntoPaperAutosuggest)
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

function downloadBibFile(ids: Array<string>) {
  if (ids.length > 0) {
    const idParams = buildIDParams(ids);
    window.location.href = `${API_URL}/export/bib?${idParams}`
  }
}

function downloadRisFile(ids: Array<string>) {
  if (ids.length > 0) {
    const idParams = buildIDParams(ids);
    window.location.href = `${API_URL}/export/ris?${idParams}`
  }
}

export default {
  queryGraph,
  getPaper,
  getPapers,
  connectPapers,
  getPaperIds,
  getZoteroAuthUrl,
  autosuggestSearch,
  downloadBibFile,
  downloadRisFile
}
