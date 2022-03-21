
import { defineStore } from 'pinia'
import { setDoc, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, onSnapshot, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { usersCol, paperCollectionsCol } from '@/plugins/firebase'
import { PaperCollection, User, ItemVisibility, ZoteroToken } from '../types/userTypes';
import { PaperID } from '@/types/incitefulTypes';
import { useUserStore } from './user'

export const useDBStore = defineStore({
    id: 'firestoreDB',
    state: () => {
        const userStore = useUserStore()
        return {
            paperCollections: undefined as PaperCollection[] | undefined,
            userDoc: undefined as DocumentSnapshot<User> | undefined,
            userStore,
            db: {
                users: usersCol,
                paperCollections: paperCollectionsCol
            },
        }
    },
    actions: {
        async savePaperCollection(name: string, ids: PaperID[]) {
            console.log('savePaperCollection', name, ids)
            if (this.userDoc) {
                const collection: PaperCollection = {
                    id: null,
                    ownerId: this.userDoc.id,
                    name: name,
                    parentID: null,
                    visibility: ItemVisibility.Hidden,
                    papers: ids.map(id => ({
                        paperId: id,
                        zoteroKey: null
                    })),
                    zoteroKey: null,
                    dateCreated: Timestamp.now()
                }
                await addDoc(this.db.paperCollections, collection)
            }
        },
        async addPaperToCollection(collectionId: string, id: PaperID) {
            await this.addPapersToCollection(collectionId, [id])
        },
        async addPapersToCollection(collectionId: string, ids: PaperID[]) {
            if (this.paperCollections) {
                if (collectionId) {
                    await updateDoc(doc(paperCollectionsCol, collectionId), {
                        papers: arrayUnion(...ids.map(id => ({
                            paperId: id,
                            zoteroKey: null
                        })))
                    });
                }
            }
        },
        async saveZoteroToken(token: ZoteroToken) {
            console.log("saveZoteroToken", token)
            if (this.userDoc) {
                await updateDoc(this.userDoc.ref, {
                    zoteroToken: token
                })
            }
        },
        async clearZoteroToken() {
            console.log("clearingZoteroToken")
            if (this.userDoc) {
                await updateDoc(this.userDoc.ref, {
                    zoteroToken: null
                })
            }
        },
        async saveUser(user: User) {
            await setDoc(doc(this.db.users, user.id), user)
        },
        async bind(userId: string | undefined) {
            const promises = [];
            promises.push(this.bindCollections(userId))
            promises.push(this.bindUserData(userId))
            return await Promise.all(promises)
        },
        async bindCollections(userId: string | undefined) {
            if (userId) {
                const q = query(paperCollectionsCol, where("ownerId", "==", userId));

                const unsub = onSnapshot(q, (querySnapshot) => {
                    this.paperCollections = []

                    querySnapshot.forEach((doc) => {
                        if (this.paperCollections) {
                            const data = doc.data()
                            data.id = doc.id
                            this.paperCollections.push(data);
                        }
                    });
                });

                return () => {
                    unsub()
                    this.paperCollections = []
                }
            }
        },
        async bindUserData(userId: string | undefined) {
            if (userId) {
                const unsub = onSnapshot(doc(usersCol, userId), (doc) => {
                    this.userDoc = doc

                    if (!this.userData)
                        this.saveUser({ id: userId, favoritePapers: [], zoteroToken: null })
                });

                return () => {
                    unsub()
                    this.userDoc = undefined
                }
            }
        },
        async awaitUserDataLoad(f: () => void) {
            const interval = setInterval(() => {
                if (!this.userStore.isSignedIn) clearInterval(interval)
                if (this.userData) {
                    f()
                    clearInterval(interval)
                }
            }, 100)
        },
        async addFavorite(id: PaperID) {
            await this.addFavorites([id])
        },
        async addFavorites(ids: PaperID[]) {
            if (this.userDoc) {
                await updateDoc(this.userDoc.ref, {
                    favoritePapers: arrayUnion(...ids)
                });
            }
        },
        async removeFavorite(id: PaperID) {
            if (this.userDoc) {
                await updateDoc(this.userDoc.ref, {
                    favoritePapers: arrayRemove(id)
                });
            }
        },
        async toggleFavorite(id: PaperID) {
            if (this.userDoc) {
                if (!this.isPaperFavorite(id))
                    this.addFavorite(id)
                else
                    this.removeFavorite(id)
            }
        }
    },
    getters: {
        userData(state) {
            return state.userDoc?.data()
        },
        isPaperFavorite() {
            return (id: PaperID) => {
                if (this.userData)
                    return this.userData.favoritePapers.some(x => x == id)
                else return false
            }
        },
    },
})