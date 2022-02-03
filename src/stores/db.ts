
import { defineStore } from 'pinia'
import { setDoc, addDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { usersCol, paperCollectionsCol } from '@/plugins/firebase'
import { PaperCollection, User } from '../types/user';

export const useDBStore = defineStore({
    id: 'firestoreDB',
    state: () => {
        return {
            paperCollections: [] as PaperCollection[],
            user: undefined as User | undefined,
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
            await Promise.all([this.bindCollections(userId), this.bindUserData(userId)])
        },
        async bindCollections(userId: string | undefined) {
            if (userId) {
                const q = query(paperCollectionsCol, where("ownerId", "==", userId));

                onSnapshot(q, (querySnapshot) => {
                    this.paperCollections = []
                    querySnapshot.forEach((doc) => {
                        this.paperCollections.push(doc.data());
                    });
                    return this.paperCollections
                });
            }
        },
        async bindUserData(userId: string | undefined) {
            if (userId) {
                onSnapshot(doc(usersCol, userId), (doc) => {
                    this.user = doc.data()
                });
            }
        }
    },
    getters: {

    },
})