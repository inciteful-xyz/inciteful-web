
import { defineStore } from 'pinia'
import { addDoc, updateDoc, arrayUnion, doc, query, where, onSnapshot, Timestamp, deleteDoc } from 'firebase/firestore';
import { paperCollectionsCol } from '@/plugins/firebase'
import { PaperCollection, ItemVisibility } from '../types/userTypes';
import { PaperID } from '@/types/incitefulTypes';
import { useUserStore } from './userStore'

export const usePaperCollectionStore = defineStore({
    id: 'firestoreDB',
    state: () => {
        const userStore = useUserStore()
        return {
            paperCollections: undefined as PaperCollection[] | undefined,
            userStore,
        }
    },
    actions: {
        async savePaperCollection(name: string, ids: PaperID[]): Promise<string | undefined> {
            console.log('savePaperCollection', name, ids)
            if (name && this.userStore.userDataDoc) {
                const collection: PaperCollection = {
                    id: null,
                    ownerId: this.userStore.userDataDoc.id,
                    name: name,
                    parentID: null,
                    visibility: ItemVisibility.Hidden,
                    papers: [],
                    dateCreated: Timestamp.now()
                }
                const doc = await addDoc(paperCollectionsCol, collection)
                await this.addPapersToCollection(doc.id, ids)
                return doc.id
            }
        },
        async deletePaperCollection(id: string) {
            deleteDoc(doc(paperCollectionsCol, id))
        },
        async addPaperToCollection(collectionId: string, id: PaperID) {
            await this.addPapersToCollection(collectionId, [id])
        },
        async addPapersToCollection(collectionId: string, ids: PaperID[]) {
            if (this.paperCollections) {
                if (collectionId) {
                    await updateDoc(doc(paperCollectionsCol, collectionId), {
                        id: collectionId,
                        papers: arrayUnion(...ids.map(id => ({
                            paperId: id,
                            zoteroKey: null
                        })))
                    });
                }
            }
        },
        async bind(userId: string | undefined) {
            if (userId) {
                const q = query(paperCollectionsCol, where("ownerId", "==", userId));

                const unsub = onSnapshot(q, (querySnapshot) => {
                    this.paperCollections = []

                    querySnapshot.forEach((doc) => {
                        if (this.paperCollections) {
                            const data = doc.data()
                            data.id = doc.id
                            this.paperCollections.push(data);
                            this.paperCollections.sort()
                        }
                    });
                });

                return () => {
                    unsub()
                    this.paperCollections = []
                }
            }
        },
    },
    getters: {
        getPaperCollection(state): (id: string) => PaperCollection | undefined {
            return (id: string) => {
                if (state.paperCollections) {
                    return state.paperCollections.find(c => c.id === id)
                }
            }
        }
    },
})