import { Paper } from '@/types/inciteful'
import { stemmer } from 'stemmer'

const stop = new Set([
  'new',
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'based',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now'
])

export interface TermCount {
  term: string;
  count: number;
}

function extract (papers: Paper[]): TermCount[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keywords: Record<string, number> = {}
  papers.forEach(p => {
    const title = p.title.replace(/\W/g, ' ').toLowerCase()
    new Set(title.split(' ')).forEach(k => {
      if (k && !stop.has(k) && k.length > 1) {
        keywords[k] ? keywords[k]++ : (keywords[k] = 1)
      }
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stemmedKeywords: Record<string, TermCount> = {}
  Object.entries(keywords).forEach(k => {
    const sk = stemmer(k[0])
    if (!stemmedKeywords[sk]) {
      const tc: TermCount = { term: k[0], count: k[1] }
      stemmedKeywords[sk] = tc
    } else {
      stemmedKeywords[sk].count = stemmedKeywords[sk].count + k[1]
    }
  })

  const groupedKeywords = Object.entries(stemmedKeywords)
    .map(k => k[1])
    .filter(k => k.count > 1)

  groupedKeywords.sort((a, b) => b.count - a.count)
  return groupedKeywords.slice(0, 15)
}

export default {
  extract
}
