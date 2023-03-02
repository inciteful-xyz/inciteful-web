import axios, { AxiosError } from 'axios';
import { logError } from './logging'

function handleServiceErr(err: AxiosError) {
    if (err && err.response && err.response.status !== 404) {
        logError(err)
    }
}

export function unpaywall(doi: string) {
    return axios
        .get(`https://api.unpaywall.org/v2/${doi}?email=info@inciteful.xyz`)
        .then(response => response.data)
        .catch(err => {
            handleServiceErr(err)
            return undefined
        })
}