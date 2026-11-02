// Decides whether search-bar input is a list of paper IDs or a text search.
// Pieces are split on commas; every piece must be an ID, otherwise the whole
// input runs as a normal search (so titles containing commas still search).

// The text a selected autosuggest leaves behind: "<title> (W<digits>)".
const SUGGESTION = /\s\(W(\d+)\)$/i
const DOI = /10\.\d{4,9}\/\S+/i
const BARE_NUMBER = /^(\d+)$/
const PMID = /^(?:pmid|pubmed):?\s*(\d+)$/i
const PMCID = /^(?:pmc|pmcid:?\s*(?:pmc)?)(\d+)$/i
const ARXIV = /^(?:arxiv:?\s*)?(\d{4}\.\d{4,5})(?:v\d+)?$/i
const OPENALEX = /^W\d+$/i
const PREFIXED = /^(mag|s2id|oiid|oaid|medline|dblp):\s*(\S+)$/i
const HTTP_URL = /^https?:\/\/\S+$/i

function pieceToId(piece: string): string | null {
  let m: RegExpMatchArray | null
  if ((m = piece.match(SUGGESTION))) return `W${m[1]}`
  if ((m = piece.match(DOI))) return m[0]
  if ((m = piece.match(BARE_NUMBER)) || (m = piece.match(PMID))) return `pmid:${m[1]}`
  if ((m = piece.match(PMCID))) return `pmcid:${m[1]}`
  if ((m = piece.match(ARXIV))) return `arxiv:${m[1]}`
  if (OPENALEX.test(piece)) return piece
  if ((m = piece.match(PREFIXED))) return `${m[1].toLowerCase()}:${m[2]}`
  if (HTTP_URL.test(piece)) return piece
  return null
}

// Returns null when the input should run as a normal search, otherwise the
// IDs to send to api.getPaperIds, in input order.
export function searchInputToIds(input: string): string[] | null {
  const trimmed = input.trim()
  const suggestion = trimmed.match(SUGGESTION)
  if (suggestion) return [`W${suggestion[1]}`]

  const pieces = trimmed.split(',').map(p => p.trim()).filter(p => p.length > 0)
  if (pieces.length === 0) return null

  const ids: string[] = []
  for (const piece of pieces) {
    const id = pieceToId(piece)
    if (id === null) return null
    ids.push(id)
  }
  return ids
}
