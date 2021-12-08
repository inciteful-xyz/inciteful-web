import bib2json from 'bib2json'

function idsFromBib (bibText: string) {
  const results = bib2json(bibText)
  const ids: string[] = []
  results.entries.forEach(
    (element: {
      Fields: { incitefulid: string; magid: string; doi: string; url: string };
    }) => {
      if (element.Fields.incitefulid) {
        ids.push(element.Fields.incitefulid)
      } else if (element.Fields.magid) {
        ids.push(`MAG:${element.Fields.magid}`)
      } else if (element.Fields.doi) {
        ids.push(element.Fields.doi)
      }

      if (element.Fields.url) {
        ids.push(element.Fields.url)
      }
    }
  )

  return ids
}

export default {
  idsFromBib
}
