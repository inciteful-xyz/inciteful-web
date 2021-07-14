import doiRegex from 'doi-regex';

function isExactDoi(doi) {
    return !doi ? false : doiRegex({ exact: true }).test(doi);
}

export default {
    isExactDoi,
}