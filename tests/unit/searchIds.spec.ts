import { describe, it, expect } from 'vitest'
import { searchInputToIds } from '@/utils/searchIds'

describe('searchInputToIds', () => {
  it('searches titles that contain a comma', () => {
    expect(searchInputToIds('Global cancer statistics, 2018')).toBeNull()
    expect(searchInputToIds('Cancer statistics, 2020')).toBeNull()
  })
  it('searches plain titles', () => {
    expect(searchInputToIds('deep learning')).toBeNull()
  })
  it('searches a list mixing an ID and words', () => {
    expect(searchInputToIds('10.1038/nature14539, deep learning')).toBeNull()
  })
  it('opens a pasted list of DOIs', () => {
    expect(searchInputToIds('10.1038/nature14539, 10.1145/3065386,10.48550/arXiv.1706.03762'))
      .toEqual(['10.1038/nature14539', '10.1145/3065386', '10.48550/arXiv.1706.03762'])
  })
  it('extracts a DOI from a prefix or a URL', () => {
    for (const s of ['DOI: 10.1038/nature14539', 'doi:10.1038/nature14539', 'doi.org/10.1038/nature14539',
                     'https://doi.org/10.1038/nature14539', 'https://dx.doi.org/10.1038/nature14539'])
      expect(searchInputToIds(s)).toEqual(['10.1038/nature14539'])
  })
  it('ignores empty pieces', () => {
    expect(searchInputToIds('10.1038/nature14539, ')).toEqual(['10.1038/nature14539'])
    expect(searchInputToIds(' , ')).toBeNull()
    expect(searchInputToIds('')).toBeNull()
  })
  it('sends a bare number as a PMID', () => {
    expect(searchInputToIds(' 26017442 ')).toEqual(['pmid:26017442'])
    expect(searchInputToIds('26017442, 29313949')).toEqual(['pmid:26017442', 'pmid:29313949'])
  })
  it('normalises PMID, PMCID and arXiv spellings', () => {
    expect(searchInputToIds('PMID: 26017442')).toEqual(['pmid:26017442'])
    expect(searchInputToIds('PubMed: 26017442')).toEqual(['pmid:26017442'])
    expect(searchInputToIds('PMC4567890')).toEqual(['pmcid:4567890'])
    expect(searchInputToIds('PMCID: PMC4567890')).toEqual(['pmcid:4567890'])
    expect(searchInputToIds('arXiv:1706.03762v5')).toEqual(['arxiv:1706.03762'])
    expect(searchInputToIds('arXiv: 1706.03762')).toEqual(['arxiv:1706.03762'])
    expect(searchInputToIds('1706.03762')).toEqual(['arxiv:1706.03762'])
  })
  it('passes OpenAlex IDs and other URLs through unchanged', () => {
    for (const id of ['W2919115771', 'https://pubmed.ncbi.nlm.nih.gov/26017442/',
                      'https://arxiv.org/abs/1706.03762'])
      expect(searchInputToIds(id)).toEqual([id])
  })
  it('reads the OpenAlex ID from a selected suggestion', () => {
    expect(searchInputToIds('Deep learning (W2919115771)')).toEqual(['W2919115771'])
    expect(searchInputToIds('Global cancer statistics 2018: GLOBOCAN estimates, of incidence (W2883223415)'))
      .toEqual(['W2883223415'])
    expect(searchInputToIds('Deep learning (W2919115771), 10.1145/3065386'))
      .toEqual(['W2919115771', '10.1145/3065386'])
  })
})
