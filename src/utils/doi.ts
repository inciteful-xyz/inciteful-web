import doiRegex from 'doi-regex'

function isExactDoi (doi: string) {
  return !doi ? false : doiRegex({ exact: true }).test(doi)
}

export default {
  isExactDoi
}
