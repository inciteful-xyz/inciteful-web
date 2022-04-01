import api from 'zotero-api-client'
import { ZoteroToken, ZoteroCollection } from '../types/zoteroTypes';

async function getCollections(token: ZoteroToken | undefined): Promise<ZoteroCollection[]> {
    if (token) {
        const myApi = api(token.oauthTokenSecret).library('user', token.userId)
        try {
            const collections = await myApi.collections().get()

            return collections.getData()
        } catch (e) {
            return []
        }
    }

    return []
}

async function createCollection(name: string, token: ZoteroToken | undefined): Promise<ZoteroCollection | undefined> {
    if (token) {
        const myApi = api(token.oauthTokenSecret).library('user', token.userId)
        try {
            const collections = await myApi.collections().post([{
                name,
                parentCollection: false
            }])

            return collections.getData()[0]
        } catch (e) {
            console.log(e)
            return undefined
        }
    }

    return undefined
}

export default {
    getCollections,
    createCollection
}