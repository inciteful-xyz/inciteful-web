import {
  OAAuthorship,
  OAAutosuggestResult,
  OAAutosuggestResponse,
  OAPaper,
  OAPaperSearchResults
} from '../types/openAlexTypes'
import { Author, PaperAutosuggest, Paper } from '../types/incitefulTypes'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { logError } from './logging'

function handleServiceErr(err: AxiosError) {
  if (err && err.response && err.response.status !== 404) {
    logError(err)
  }
}

export function searchOpenAlex(query: string): Promise<Paper[]> {
  if (query) {
    return axios
      .get(
        `https://api.openalex.org/works?search=${encodeURIComponent(
          query
        )}&mailto=info@inciteful.xyz`
      )
      .then((res: AxiosResponse<OAPaperSearchResults>) => {
        if (res.data && res.data.results) {
          return res.data.results
            .map(convertOAPaperToPaper)
            .filter(p => p.num_cited_by > 0 || p.num_citing > 0)
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
  try {
    const newP = {
      id: trimOAUrl(p.id),
      title: p.title || 'NA',
      author: p.authorships.map(convertOAAuthorToAuthor),
      published_year: p.publication_year || 1900,
      journal: p.host_venue ? p.host_venue.display_name : undefined,
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
    return axios
      .get(
        `https://api.openalex.org/autocomplete/works?q=${encodeURIComponent(
          query
        )}&mailto=info@inciteful.xyz`
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
    return axios
      .get(
        `https://api.openalex.org/works/${encodeURIComponent(
          id
        )}&mailto=info@inciteful.xyz`
      )
      .then((res: AxiosResponse<OAPaper>) => {
        return res.data
      })
      .catch(err => {
        if (err.response && err.response.status == 404) {
          return Promise.resolve(undefined)
        }

        handleServiceErr(err)
        return Promise.reject()
      })
  }

  return Promise.resolve(undefined)
}

export function getOAPapers(ids: string[]): Promise<OAPaper[]> {
  //example endpoint: https://api.openalex.org/works?filter=openalex:W4224016882|W4223895588
  if (ids && ids.length > 0) {
    return axios
      .get(
        `https://api.openalex.org/works?filter=openalex:${ids
          .map(id => `${id}`)
          .join('|')}&mailto=info@inciteful.xyz`
      )
      .then((res: AxiosResponse<OAPaperSearchResults>) => {
        return res.data.results
      })
      .catch(err => {
        handleServiceErr(err)
        return Promise.reject()
      })
  }

  return Promise.resolve([])
}
