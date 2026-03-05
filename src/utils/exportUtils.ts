import { Paper } from '../types/incitefulTypes';
import { head } from './head';

export function sendDataUpdated() {
  document.dispatchEvent(
    new Event('ZoteroItemUpdated', {
      bubbles: true,
      cancelable: true
    })
  )
}

export function setExportHeaders(papers: Paper[]) {
  if (!papers) return

  const meta: { name: string; content: string | undefined }[] = [];
  papers.forEach((paper: Paper) => {
    if (paper.doi) {
      meta.push({
        name: 'citation_doi',
        content: paper.doi
      })
    }
  })

  head.push({ meta })

  setTimeout(() => {
    sendDataUpdated()
  }, 500)
}
