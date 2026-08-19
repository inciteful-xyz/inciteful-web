import {
  OAAuthorship,
  OAAutosuggestResult,
  OAAutosuggestResponse,
  OAPaper,
  OAPaperSearchResults
} from '../types/openAlexTypes'
import { Author, PaperAutosuggest, Paper } from '../types/incitefulTypes'
import axios, { AxiosError, AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'
import { logError } from './logging'
import doiHelpers from './doi'

const oaApi = axios.create()

axiosRetry(oaApi, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: err =>
    axiosRetry.isNetworkOrIdempotentRequestError(err) ||
    err.response?.status === 429
})

function handleServiceErr(err: AxiosError) {
  if (err && err.response && err.response.status !== 404) {
    logError(err)
  }
}

function searchOpenAlexInternal(query: string): Promise<Paper[]> {
  if (query == null || query == undefined || query == "")
    return Promise.resolve([])

  const doi = doiHelpers.buildDoi(query)
  if (doi) {
    return getOAPaper(doi).then(p => {
      if (p)
        return [convertOAPaperToPaper(p)]
      else
        return Promise.resolve([])
    })
  } else {
    //remove non alphanumeric characters
    query = query.replace(/[^a-zA-Z0-9 ]/g, ' ')
    return titleSearch(query).then(papers => {
      if (papers.length > 0)
        return papers

      return fullSearch(query).then(papers => {
        if (papers.length > 0)
          return papers

        return []
      })
    })
  }
}

// Search failures (rate limits, network errors) degrade to an empty result
// set so callers never see a rejected promise. Errors are already logged in
// genericSearch/getOAPaper.
export function searchOpenAlex(query: string): Promise<Paper[]> {
  return searchOpenAlexInternal(query).catch(() => [])
}

function titleSearch(query: string): Promise<Paper[]> {
  return genericSearch(query, 'https://api.openalex.org/works?filter=title.search:')
}

function fullSearch(query: string): Promise<Paper[]> {
  return genericSearch(query, 'https://api.openalex.org/works?search=')
}

function genericSearch(query: string, searchUrl: string): Promise<Paper[]> {
  return oaApi
    .get(
      `${searchUrl}${encodeURIComponent(
        query
      )}&mailto=hello@incitefulmed.com`
    )
    .then((res: AxiosResponse<OAPaperSearchResults>) => {
      if (res.data && res.data.results) {
        const results = res.data.results
          .map(convertOAPaperToPaper)

        const cited_results = results
          .filter(p => p.num_cited_by > 0 || p.num_citing > 0)

        if (cited_results.length == 0)
          return results
        else
          return cited_results
      } else {
        return Promise.reject(new Error('OpenAlex search: malformed response'))
      }
    })
    .catch(err => {
      handleServiceErr(err)
      return Promise.reject(err)
    })
}

function convertOAPaperToPaper(p: OAPaper): Paper {
  try {
    const newP = {
      id: trimOAUrl(p.id),
      title: p.title || 'NA',
      author: p.authorships.map(convertOAAuthorToAuthor),
      published_year: p.publication_year || 1900,
      journal: p.primary_location?.source?.display_name,
      num_cited_by: p.cited_by_count,
      num_citing: p.referenced_works.length,
      doi: p.doi,
      pages: p.biblio.first_page + '-' + p.biblio.last_page,
      volume: p.biblio.volume
    }
    return newP
  } catch (e) {
    console.log(e)
    throw e
  }
}

function convertOAAuthorToAuthor(a: OAAuthorship, index: number): Author {
  return {
    author_id: a.author.id ? parseInt(trimOAUrl(a.author.id).slice(1)) : undefined,
    name: a.author.display_name,
    institution:
      !a.institutions || a.institutions.length == 0
        ? undefined
        : {
          id: !a.institutions[0].id
            ? undefined
            : parseInt(trimOAUrl(a.institutions[0].id).slice(1)),
          name: a.institutions[0].display_name
        },
    sequence: index
  }
}

function trimOAUrl(url: string): string {
  return url.replace('https://openalex.org/', '')
}

export function searchOAAutocomplete(
  query: string
): Promise<PaperAutosuggest[]> {
  if (query) {
    return oaApi
      .get(
        `https://api.openalex.org/autocomplete/works?q=${encodeURIComponent(
          query
        )}&mailto=hello@incitefulmed.com`
      )
      .then((res: AxiosResponse<OAAutosuggestResponse>) => {
        if (res.data && res.data.results && res.data.results.length > 0) {
          return res.data.results.map(convertOAAutocomplete)
        } else {
          // Rejection signals "no results from this source" to Promise.any
          return Promise.reject(new Error('No OpenAlex autocomplete results'))
        }
      })
      .catch(err => {
        handleServiceErr(err)
        return Promise.reject(err)
      })
  }
  return Promise.resolve([])
}

function convertOAAutocomplete(p: OAAutosuggestResult): PaperAutosuggest {
  return {
    id: trimOAUrl(p.id),
    title: p.display_name,
    authors: p.hint,
    num_cited_by: p.cited_by_count
  }
}

export function getOAPaper(id: string): Promise<OAPaper | undefined> {
  if (id) {
    return oaApi
      .get(
        `https://api.openalex.org/works/${encodeURIComponent(
          id
        )}?mailto=hello@incitefulmed.com`
      )
      .then((res: AxiosResponse<OAPaper>) => {
        return res.data
      })
      .catch(err => {
        // Callers treat undefined as "paper unavailable"; never reject
        if (!err.response || err.response.status != 404) {
          handleServiceErr(err)
        }
        return undefined
      })
  }

  return Promise.resolve(undefined)
}

export function getOAPapers(ids: string[]): Promise<OAPaper[]> {
  //example endpoint: https://api.openalex.org/works?filter=openalex:W4224016882|W4223895588
  if (ids && ids.length > 0) {
    return oaApi
      .get(
        `https://api.openalex.org/works?filter=openalex:${ids
          .map(id => `${id}`)
          .join('|')}&mailto=info@incitefulmed.com`
      )
      .then((res: AxiosResponse<OAPaperSearchResults>) => {
        return res.data.results
      })
      .catch(err => {
        handleServiceErr(err)
        return Promise.reject(err)
      })
  }

  return Promise.resolve([])
}
