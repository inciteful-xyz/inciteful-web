import axios, { AxiosError, AxiosResponse } from 'axios'
import options from './options'
import axiosRetry from 'axios-retry'
import { logError } from './logging'
import { Paper, Author, PaperConnector, PaperID, PaperAutosuggest, paperIntoPaperAutosuggest } from '../types/incitefulTypes';
import { OAAutosuggestResult } from '@/types/openAlexTypes';
import { ZoteroToken } from '../types/zoteroTypes';
import { OAPaper, OAAuthorship, OAPaperSearchResults, OAAutosuggestResponse } from '../types/openAlexTypes';

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

function handleServiceErr(err: AxiosError) {
  if (err && err.response && err.response.status !== 404) {
    logError(err)
  }
}

function buildIDParams(ids: string[]) {
  const idParamName = 'ids[]'

  const id_set = new Set<PaperID>();

  if (ids && ids.length > 0)
    ids.forEach(x => id_set.add(x));

  const idParams = Array.from(id_set).map(id => `${idParamName}=${id}`).join('&');
  return idParams;
}

function fixPaperID(p: Paper): Paper {
  p.id = p.id.toString()
  return p
}

function fixPaperIDs(p: Paper[]): Paper[] {
  return p.map(p => fixPaperID(p))
}

function searchOpenAlex(query: string): Promise<Paper[]> {
  if (query) {
    return axios
      .get(
        `https://api.openalex.org/works?search=${encodeURIComponent(query)}&mailto=info@inciteful.xyz`
      )
      .then((res: AxiosResponse<OAPaperSearchResults>) => {
        if (res.data && res.data.results && res.data.results.length > 0) {
          return res.data.results.map(convertOAPaperToPaper)
        } else {
          return Promise.reject()
        }
      })
      .catch(err => {
        handleServiceErr(err)
        return Promise.reject()
      })
  }
  return Promise.resolve([])
}

function convertOAPaperToPaper(p: OAPaper): Paper {
  console.log(p);
  try {
    return {
      id: trimOAUrl(p.id),
      title: p.title || 'NA',
      author: p.authorships.map(convertOAAuthorToAuthor),
      published_year: p.publication_year || 1900,
      journal: p.host_venue.display_name,
      num_cited_by: p.cited_by_count,
      num_citing: p.referenced_works.length,
      doi: p.doi,
      pages: p.biblio.first_page + '-' + p.biblio.last_page,
      volume: p.biblio.volume,
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function convertOAAuthorToAuthor(a: OAAuthorship, index: number): Author {
  return {
    author_id: parseInt(trimOAUrl(a.author.id).slice(1)),
    name: a.author.display_name,
    institution: !a.institutions || a.institutions.length == 0 ? undefined : {
      id: !a.institutions[0].id ? undefined : parseInt(trimOAUrl(a.institutions[0].id).slice(1)),
      name: a.institutions[0].display_name,
    },
    sequence: index,
  }
}


function searchOAAutocomplete(query: string): Promise<PaperAutosuggest[]> {
  if (query) {
    return axios
      .get(
        `https://api.openalex.org/autocomplete/works?q=${encodeURIComponent(query)}&mailto=info@inciteful.xyz`
      )
      .then((res: AxiosResponse<OAAutosuggestResponse>) => {
        if (res.data && res.data.results && res.data.results.length > 0) {
          return res.data.results.map(convertOAAutocomplete)
        } else {
          return Promise.reject()
        }
      })
      .catch(err => {
        handleServiceErr(err)
        return Promise.reject()
      })
  }
  return Promise.resolve([])
}

function trimOAUrl(url: string): string {
  const res = url.replace("https://openalex.org/", '')
  console.log(res);
  return res;
}

function convertOAAutocomplete(p: OAAutosuggestResult): PaperAutosuggest {
  return {
    id: trimOAUrl(p.id),
    title: p.display_name,
    authors: p.hint,
    num_cited_by: p.cited_by_count,
  };
}
// Inciteful API Calls

function queryGraphSingle(
  id: PaperID,
  sql: string,
  prune: number
): Promise<unknown[][]> {
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
): Promise<unknown[][]> {
  let url = `${API_URL}/query?${buildIDParams(ids)}`

  if (prune) {
    url = url + `&${pruneParamName}=${prune}`
  }

  return queryApi.post(url, sql).then(response => response.data)
}

function queryGraph(ids: Array<PaperID>, sql: string): Promise<unknown[][]> {
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

function getZoteroAuth(oauthToken: string): Promise<ZoteroToken | undefined> {
  return axios
    .get(`${API_URL}/zotero/auth/fetch?oauth_token=${oauthToken}`)
    .then((response: AxiosResponse<ZoteroToken>) => response.data)
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
  searchOpenAlex,
  getPaper,
  getPapers,
  connectPapers,
  getPaperIds,
  getZoteroAuthUrl,
  getZoteroAuth,
  autosuggestSearch,
  downloadBibFile,
  downloadRisFile
}
