
import { defineStore } from 'pinia'
import { setDoc, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, onSnapshot, DocumentSnapshot } from 'firebase/firestore';
import { usersCol, paperCollectionsCol } from '@/plugins/firebase'
import { PaperCollection, User } from '../types/user';
import { PaperID } from '@/types/inciteful';

export const useDBStore = defineStore({
    id: 'firestoreDB',
    state: () => {
        return {
            paperCollections: undefined as PaperCollection[] | undefined,
            userDoc: undefined as DocumentSnapshot<User> | undefined,
            db: {
                users: usersCol,
                paperCollections: paperCollectionsCol
            }
        }
    },
    actions: {
        async savePaperCollection(paperCollection: PaperCollection) {
            await addDoc(this.db.paperCollections, paperCollection)
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
                        if (this.paperCollections)
                            this.paperCollections.push(doc.data());
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