import api from 'zotero-api-client'
import { ZoteroToken, ZoteroCollection, ZoteroItem } from '../types/zoteroTypes';

async function getCollections(token: ZoteroToken): Promise<ZoteroCollection[] | undefined> {
    const zotero = api(token.oauthTokenSecret).library('user', token.userId)
    try {
        const collections = await zotero.collections().get()
        return collections.getData()
    } catch (e) {
        return undefined
    }
}

async function getItems(token: ZoteroToken, collectionKey: string): Promise<ZoteroItem[] | undefined> {
    const zotero = api(token.oauthTokenSecret).library('user', token.userId)
    try {
        const collection = await zotero.collections(collectionKey).items().get()
        return collection.getData()
    } catch (e) {
        return undefined
    }
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
    createCollection,
    getItems
}