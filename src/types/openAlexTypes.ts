
export interface OAAutosuggestResponse {
  meta: Meta
  results: OAAutosuggestResult[]
}

export interface Meta {
  count: number
  db_response_time_ms: number
  page: number
  per_page: number
}


export interface OAAutosuggestResult {
  id: string;
  display_name: string;
  hint: string;
  cited_by_count: number;
  works_count: number;
  entityType: string;
  externalId: string;
}


export interface OAPaperSearchResults {
  meta: Meta
  results: OAPaper[]
}


export interface OAPaper {
  id: string
  doi?: string
  title?: string
  display_name?: string
  publication_year?: number
  publication_date?: string
  ids: OAWorkIds
  primary_location: OAPrimaryLocation
  type?: string
  open_access: OAOpenAccess
  authorships: OAAuthorship[]
  cited_by_count: number
  biblio: OABiblio
  is_retracted: boolean
  is_paratext?: boolean
  concepts?: OAConcept[]
  mesh?: OAMesh[]
  referenced_works: string[]
  related_works: string[]
  cited_by_api_url: string
  updated_date: string
  created_date: string
}

export interface OAWorkIds {
  openalex?: string
  doi?: string
  mag?: string
  pmid?: string
  pmcid?: string
}

export interface OAPrimaryLocation {
  is_oa: boolean
  landing_page_url: string
  pdf_url: string
  source: OALocationSource
  license: string
  version: string
  is_accepted: boolean
  is_published: boolean
}

export interface OALocationSource {
  id: string
  display_name: string
  issn_l: string
  issn: string[]
  is_oa: boolean
  is_in_doaj: boolean
  host_organization: string
  host_organization_name: string
  host_organization_lineage: string[]
  host_organization_lineage_names: string[]
  type: string
}

export interface OAOpenAccess {
  is_oa: boolean
  oa_status: string
  oa_url: string
}

export interface OAMesh {
  descriptor_ui: string
  descriptor_name: string
  qualifier_ui: string
  qualifier_name?: string
  is_major_topic: boolean
}

export interface OAAuthorship {
  author_position: string
  author: OAAuthor
  institutions: OAInstitution[]
  raw_affiliation_string: string
}

export interface OAAuthor {
  id: string
  display_name: string
  orcid?: string
}

export interface OAInstitution {
  id?: string
  display_name: string
  ror: string
  country_code: string
  type: string
}

export interface OABiblio {
  volume: string
  issue: string
  first_page: string
  last_page: string
}

export interface OAConcept {
  id: string
  wikidata: string
  display_name: string
  level: number
  score: string
}

