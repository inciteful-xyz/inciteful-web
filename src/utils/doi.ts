import doiRegex from 'doi-regex'

function isExactDoi(doi: string) {
  if (doi.startsWith('http://doi.org/')) {
    doi = doi.slice('http://doi.org/'.length)
  }

  return !doi ? false : doiRegex({ exact: true }).test(doi)
}


function buildDoi(doi: string): string | undefined {
  if (!doi) return undefined
  if (doi.startsWith('http://doi.org/')) {
    return doi
  } else {

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
