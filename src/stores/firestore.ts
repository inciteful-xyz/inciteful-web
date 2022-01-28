
import { defineStore } from 'pinia'
import { collection, addDoc, getFirestore } from "firebase/firestore";


export const useDB = defineStore({
    id: 'firestoreDB',
    state: () => {
        const store = getFirestore();
        return {
            store
        }
    },
    actions: {
        // async bindUser() {
        //     onAuthStateChanged(
        //         auth,
        //         async (user) => {
        //             this.user = user;
        //             if (user) {
        //                 this.token = await getIdTokenResult(user);
        //                 this.user = user
        //                 this.error = null
        //             }
        //         },
        //     );
        // },
    },
    getters: {
    },
})