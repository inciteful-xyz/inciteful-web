
import { defineStore } from 'pinia'
import { updateDoc, DocumentSnapshot, deleteDoc, setDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { zoteroDataCol } from '@/plugins/firebase'
import { ZoteroData, ZoteroToken } from '@/types/zoteroTypes';
import zoteroApi from '@/utils/zoteroApi'
import zoteroSync from '@/utils/zoteroSync'
import incitefulApi from '@/utils/incitefulApi';
import { ZoteroKey, ZoteroCollectionNode, NestedZoteroCollection, ZoteroCollection, ZoteroCollectionSync } from '../types/zoteroTypes';
import { useUserStore } from './userStore';
import { IncitefulCollection } from '../types/userTypes';
import { usePaperCollectionStore } from './paperCollectionStore';

export const useZoteroStore = defineStore({
    id: 'zoteroUserData',
    state: () => {
        return {
            paperCollectionStore: usePaperCollectionStore(),
            zoteroDataDoc: undefined as DocumentSnapshot<ZoteroData> | undefined,
        }
    },
    actions: {
        async bind(userId: string | undefined) {
            if (userId) {
                const unsub = onSnapshot(doc(zoteroDataCol, userId), async (document) => {
                    this.zoteroDataDoc = document
                });

                this.syncZotero()

                // Force Zotero background sync
                const interval = setInterval(() => {
                    this.syncZotero()
                }, 30000)

                return (() => {
                    unsub()
                    this.zoteroDataDoc = undefined
                    clearInterval(interval)
                })
            }
        },
        async saveZoteroToken(token: ZoteroToken) {
            if (this.zoteroDataDoc) {
                updateDoc(this.zoteroDataDoc.ref, {
                    token
                })
            } else {
                const userStore = useUserStore()
                console.log('userID: ' + userStore.userId)
                setDoc(doc(zoteroDataCol, userStore.userId), {
                    token,
                    collections: [],
                    syncedCollections: {},
                })
            }
        },
        async clearZotero() {
            if (!this.zoteroDataDoc) return

            deleteDoc(this.zoteroDataDoc.ref)
        },
        async syncZotero() {
            if (!this.data?.token) return

            console.log("Syncing Zotero")
            // Sync Collections First
            this.syncCollectionList(this.data?.token)
            // Then sync all synced collections 

        },
        async syncCollectionToInciteful(incitefulCollectionId: string, sync: ZoteroCollectionSync) {
            if (this.data === undefined) return

            // Get current zotero collection data
            const zoteroCollection = await zoteroApi.getItems(this.data.token, sync.key)
            if (zoteroCollection === undefined) return;

            // Get the list of IDs to try and match
            const idsToMatch = zoteroSync.getIdentifiers(zoteroCollection)
            // Match IDs using API. 
            const matched = await incitefulApi.zoteroIdMatch(idsToMatch)

            // Get current inciteful collection data
            const incitefulPapers = this.paperCollectionStore.getPaperCollection(incitefulCollectionId)?.papers;
            if (incitefulPapers === undefined) return;



        },
        async syncCollectionList(token: ZoteroToken) {
            if (!this.zoteroDataDoc) return

            const ref = this.zoteroDataDoc.ref

            zoteroApi.getCollections(token).then((collections: ZoteroCollection[] | undefined) => {
                if (collections !== undefined) {
                    updateDoc(ref, {
                        collections
                    })
                }
            })
        },
        async setCollectionSync(incitefulCollectionId: string, key: ZoteroKey) {
            console.log('setCollectionSync: ' + incitefulCollectionId + ' ' + key)
            if (!this.zoteroDataDoc || !this.data) return
            const syncedCollections = this.data.syncedCollections || {}

            const collection = this.getSyncedByZoteroKey(key)

            //A Zotero Collection can only be synced to one inciteful collection
            if (collection?.id) delete syncedCollections[collection.id]

            syncedCollections[incitefulCollectionId] = {
                key: key,
                dateUpdated: Timestamp.now(),
                dateCreated: Timestamp.now(),
                itemSyncStatus: {}
            };


            setDoc(this.zoteroDataDoc.ref, {
                collections: this.data?.collections,
                syncedCollections,
                token: this.data?.token
            })

        },
        async clearSyncByIncitefulKey(incitefulCollectionId: string) {
            if (!this.zoteroDataDoc || !this.data || !this.data.syncedCollections) return
            delete this.data.syncedCollections[incitefulCollectionId]

            setDoc(this.zoteroDataDoc.ref, {
                token: this.data.token,
                syncedCollections: this.data.syncedCollections,
                collections: this.data.collections
            })
        },
        async clearSyncByZoteroKey(key: ZoteroKey) {
            const collection = this.getSyncedByZoteroKey(key)
            if (!collection || !collection.id) return
            this.clearSyncByIncitefulKey(collection.id)
        },
        async createCollection(name: string, onSuccess: (collection: ZoteroCollection) => void) {
            const token = this.data?.token;

            if (token) {
                const result = await zoteroApi.createCollection(name, token)

                await this.syncCollectionList(token)

                if (result) {
                    onSuccess(result)
                }
            }
        }
    },
    getters: {
        data(state): ZoteroData | undefined {
            return state.zoteroDataDoc?.data()
        },
        isSetup(): boolean {
            return !!(this.data?.token !== undefined)
        },
        unsyncedCollections(): ZoteroCollection[] {
            const collections = this.data?.collections ?? []
            return collections.filter((collection) => !this.isSyncedByZoteroKey(collection.key))
        },
        nestedCollections(): ZoteroCollectionNode | undefined {
            const collections = this.data?.collections

            if (!collections) return undefined

            const lookup: Record<string, NestedZoteroCollection> = Object.assign({}, ...collections.map(c => {
                return { [c.key]: c as NestedZoteroCollection }
            }))

            const root: ZoteroCollectionNode = {}

            for (const key in lookup) {
                const c = lookup[key]
                if (c.parentCollection) {
                    const parent = lookup[c.parentCollection]
                    if (parent) {
                        if (!parent.childCollections) {
                            parent.childCollections = {}
                        }

                        parent.childCollections[c.key] = c
                    }
                } else {
                    root[c.key] = c
                }
            }

            return root
        },
        getZoteroCollection(): (zoteroKey: ZoteroKey) => ZoteroCollection | undefined {
            return (zoteroKey: ZoteroKey) => {
                const collections = this.data?.collections
                if (!collections) return undefined
                return collections.find(c => c.key === zoteroKey)
            }
        },
        getSyncedByZoteroKey(): (zoteroKey: ZoteroKey) => IncitefulCollection | undefined {
            return (zoteroKey: ZoteroKey) => {
                const sc = this.data?.syncedCollections
                if (!sc) return undefined
                const incitefulCollectionKey = Object.keys(sc).find(key => sc[key].key === zoteroKey)

                if (!incitefulCollectionKey) return undefined

                return this.paperCollectionStore.getPaperCollection(incitefulCollectionKey)
            }
        },
        isSyncedByZoteroKey(): (zoteroKey: ZoteroKey) => boolean {
            return (zoteroKey: ZoteroKey) => {
                return !!this.getSyncedByZoteroKey(zoteroKey)
            }
        },
        getSyncedByIncitefulKey(): (id: string) => ZoteroCollection | undefined {
            return (id: string) => {
                const sc = this.data?.syncedCollections
                if (!sc) return undefined
                const zoteroKey = sc[id].key

                return this.getZoteroCollection(zoteroKey)
            }
        },
        isSyncedByIncitefulKey(): (id: string) => boolean {
            return (id: string) => {
                return !!this.getSyncedByIncitefulKey(id)
            }
        }
    }
})