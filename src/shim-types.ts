/* eslint-disable camelcase */

export interface Paper {
  id: string;
  doi: string;
  author?: (Author)[] | null;
  title: string;
  published_year: number;
  journal: string;
  pages: string;
  abstract: string;
  volume: string;
  external_ids?: (ExternalIds)[] | null;
  num_citing: number;
  num_cited_by: number;
}
export interface Author {
  author_id: number;
  name: string;
  sequence: number;
  affiliation: string;
}

export interface ExternalIds {
  S2ID?: string | null;
  DOI?: string | null;
  MAG?: number | null;
}

export interface SSAuthor {
  id: number;
  name: string;
  affiliation: string;
}

export interface SSPaper {
  paperId: string;
  title: string;
  authors: Array<SSAuthor>;
  year: string;
  venue: string;
  abstract: string;
  citationCount: number;
  referenceCount: number;
}
