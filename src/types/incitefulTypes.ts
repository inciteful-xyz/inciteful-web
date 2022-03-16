/* eslint-disable camelcase */

import { Emitter, EventType } from 'mitt';

export type IncitefulEmitter = Emitter<Record<EventType, unknown>>

export type PaperID = string

export interface Paper {
  id: PaperID;
  doi: string;
  author?: Author[];
  title: string;
  published_year: number;
  journal: string;
  pages: string;
  abstract: string;
  volume: string;
  external_ids?: ExternalIds[];
  num_citing: number;
  num_cited_by: number;
  distance?: number;
  path_count?: number;
  citing?: PaperID[];
  cited_by?: PaperID[];
}

export interface Author {
  author_id: number;
  name: string;
  sequence: number;
  affiliation: string;
}

export interface PaperConnector {
  source: PaperID;
  papers: Paper[];
  paths: Path[];
  connections: Connection[];
  num_paths: number;
  papers_searched: number;
  max_hops: number;
}
export interface ExternalIds {
  S2ID?: string | null;
  DOI?: string | null;
  MAG?: number | null;
}
export interface Connection {
  citing: string;
  cited: string;
}

export type Path = PaperID[]

export interface Faq {
  question: string;
  answer: string;
}

