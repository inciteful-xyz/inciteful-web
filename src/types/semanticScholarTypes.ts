
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
