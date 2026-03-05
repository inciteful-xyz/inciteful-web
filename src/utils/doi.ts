import doiRegex from 'doi-regex'

function stripDoiPrefix(doi: string): string {
  if (doi.startsWith('https://doi.org/')) return doi.slice('https://doi.org/'.length)
  if (doi.startsWith('http://doi.org/')) return doi.slice('http://doi.org/'.length)
  return doi
}

function isExactDoi(doi: string) {
  doi = stripDoiPrefix(doi)

  return !doi ? false : doiRegex({ exact: true }).test(doi)
}


function buildDoi(doi: string): string | undefined {
  if (!doi) return undefined

  if (doi.startsWith('https://doi.org/') || doi.startsWith('http://doi.org/')) {
    return doi.startsWith('http://') ? doi.replace('http://', 'https://') : doi
  } else {
    if (!isExactDoi(doi))
      return undefined

    if (doi.startsWith('doi:')) {
      doi = doi.slice('doi:'.length)
    }

    return `https://doi.org/${doi}`
  }
}

export default {
  isExactDoi,
  buildDoi
}
