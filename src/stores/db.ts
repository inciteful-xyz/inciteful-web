
import { defineStore } from 'pinia'
import { collection, setDoc, addDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
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
            console.log("binding " + userId)
            const q = query(paperCollectionsCol, where("ownerId", "==", userId));

            onSnapshot(q, (querySnapshot) => {
                this.paperCollections = []
                querySnapshot.forEach((doc) => {
                    this.paperCollections.push(doc.data());
                });

                console.log("Current collections: ", JSON.stringify(this.paperCollections));

                return this.paperCollections
            });

            onSnapshot(doc(usersCol, userId), (doc) => {
                this.user = doc.data()
                console.log("Current data: ", doc.data());
            });
        }
    },
    getters: {

    },
})