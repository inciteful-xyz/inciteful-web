import bib2json from 'bib2json'

function idsFromBib(bibText: string) {
  const results = bib2json(bibText)
  const ids: string[] = []
  results.entries.forEach(
    (element: {
      Fields: { incitefulid: string; magid: string; doi: string; url: string; URL: string; DOI: string };
    }) => {
      console.log(element)
      if (element.Fields.incitefulid) {
        ids.push(element.Fields.incitefulid)
      } else if (element.Fields.magid) {
        ids.push(`MAG:${element.Fields.magid}`)
      } else if (element.Fields.doi) {
        ids.push(element.Fields.doi)
      } else if (element.Fields.DOI) {
        ids.push(element.Fields.DOI)
      }

      if (element.Fields.url) {
        ids.push(element.Fields.url)
      }
      if (element.Fields.URL) {
        ids.push(element.Fields.URL)
      }
    }
  )

  console.log(ids)
  return ids
}

export default {
  idsFromBib
}
