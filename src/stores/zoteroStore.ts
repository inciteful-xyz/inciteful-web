
import { defineStore } from 'pinia'
import { updateDoc, DocumentSnapshot, deleteDoc, setDoc, doc, onSnapshot } from 'firebase/firestore';
import { zoteroDataCol } from '@/plugins/firebase'
import { ZoteroData, ZoteroToken } from '@/types/zoteroTypes';
import zoteroApi from '@/utils/zotero'
import { ZoteroKey, ZoteroCollectionNode, NestedZoteroCollection, ZoteroCollection } from '../types/zoteroTypes';
import { useUserStore } from './userStore';
import { PaperCollection } from '../types/userTypes';
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

                // Force Zotero background sync
                const interval = setInterval(() => {
                    this.syncCollectionList()
                    console.log("syncing zotero")
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
        async syncCollectionList() {
            if (!this.data?.token) return

            this.syncCollectionListWithToken(this.data?.token)
        },
        async syncCollectionListWithToken(token: ZoteroToken) {
            if (!this.zoteroDataDoc) return
            const ref = this.zoteroDataDoc.ref
            zoteroApi.getCollections(token).then((collections: ZoteroCollection[]) => {
                updateDoc(ref, {
                    collections
                })
            })
        },
        async setCollectionSync(incitefulCollectionId: string, key: ZoteroKey) {
            if (!this.zoteroDataDoc) return
            const syncedCollections = this.data?.syncedCollections || {}
            syncedCollections[incitefulCollectionId] = key

            updateDoc(this.zoteroDataDoc.ref, {
                syncedCollections
            })

        },
        async clearSyncByIncitefulKey(incitefulCollectionId: string) {
            if (!this.zoteroDataDoc || !this.data?.syncedCollections) return
            delete this.data.syncedCollections[incitefulCollectionId]

            updateDoc(this.zoteroDataDoc.ref, {
                syncedCollections: this.data.syncedCollections
            })
        },
        async clearSyncByZoteroKey(key: ZoteroKey) {
            const collection = this.getSyncedByZoteroKey(key)
            if (!collection || !collection.id) return
            this.clearSyncByIncitefulKey(collection.id)
        }
    },
    getters: {
        data(state): ZoteroData | undefined {
            return state.zoteroDataDoc?.data()
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
        getSyncedByZoteroKey(): (zoteroKey: ZoteroKey) => PaperCollection | undefined {
            return (zoteroKey: ZoteroKey) => {
                const sc = this.data?.syncedCollections
                if (!sc) return undefined
                const incitefulCollectionKey = Object.keys(sc).find(key => sc[key] === zoteroKey)

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
                const zoteroKey = sc[id]

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