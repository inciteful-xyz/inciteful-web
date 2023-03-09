/* eslint-disable camelcase */

import { Emitter, EventType } from 'mitt'

export type IncitefulEmitter = Emitter<Record<EventType, unknown>>

export interface IIndexable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type PaperID = string

export enum ReferenceManagers {
  Zotero = 'Zotero',
  Mendeley = 'Mendeley',
  EndNote = 'EndNote',
  RefWorks = 'RefWorks'
}

export interface PaperAutosuggest {
  id: PaperID
  title: string
  authors: string
  num_cited_by: number
}

function authorListDisplay (a: Author[] | undefined): string {
  if (!a) return ''

  let display = a
    .slice(0, 3)
    .map(x => x.name)
    .join(', ')

  if (a.length > 3) display += ', et al'

  return display
}

export function paperIntoPaperAutosuggest (p: Paper): PaperAutosuggest {
  return {
    id: p.id,
    title: p.title || 'NA',
    authors: authorListDisplay(p.author),
    num_cited_by: p.num_cited_by
  }
}

export interface Paper {
  id: PaperID
  doi?: string
  author: Author[]
  title: string
  published_year: number
  journal?: string
  pages: string
  volume: string
  num_citing: number
  num_cited_by: number
  distance?: number
  path_count?: number
  citing?: PaperID[]
  cited_by?: PaperID[]
}

export interface LockedPaper extends Paper {
  isLocked: boolean
}

export interface Author {
  author_id: number
  name: string
  sequence: number
  position?: string
  institution?: Institution
}

export interface Institution {
  id?: number
  name: string
}

export interface PaperConnector {
  source: PaperID
  papers: Paper[]
  paths: Path[]
  connections: Connection[]
  num_paths: number
  papers_searched: number
  max_hops: number
}
export interface ExternalIds {
  DOI?: string | null
  PMID?: string | null
  PMCID?: string | null
}
export interface Connection {
  citing: string
  cited: string
}

export type Path = PaperID[]

export type QueryValue = string | number | Author[]

export type QueryRow = Record<string, QueryValue>

export type QueryResults = QueryRow[]

export interface Faq {
  question: string
  answer: string
}
