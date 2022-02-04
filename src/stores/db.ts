
import { defineStore } from 'pinia'
import { setDoc, addDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { usersCol, paperCollectionsCol } from '@/plugins/firebase'
import { PaperCollection, User } from '../types/user';

export const useDBStore = defineStore({
    id: 'firestoreDB',
    state: () => {
        return {
            paperCollections: undefined as PaperCollection[] | undefined,
            userData: undefined as User | undefined,
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
                    this.userData = doc.data()
                });

                return () => {
                    unsub()
                    this.userData = undefined
                }
            }
        }
    },
    getters: {

    },
})