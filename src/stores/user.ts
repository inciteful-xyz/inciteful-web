
import { getAuth, createUserWithEmailAndPassword, User, AuthError, signInWithEmailAndPassword } from 'firebase/auth'
import { defineStore } from 'pinia'

export type UserState = {
    user: null | User;
    error: null | AuthError;
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: null as null | User,
            error: null as null | AuthError
        }
    },
    actions: {
        async signUp(email: string, password: string) {
            const auth = getAuth()
            return createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    // Signed in
                    console.log('Success! ', userCredential)
                    this.user = userCredential.user
                    this.error = null
                })
                .catch(error => {
                    console.log('Failed!', error)
                    this.error = error
                    this.user = null
                })
        },
        async signInWithEmailAndPassword(email: string, password: string) {
            const auth = getAuth()
            return signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    // Signed in
                    console.log('Success! ', userCredential)
                    this.user = userCredential.user
                    this.error = null
                })
                .catch(error => {
                    console.log('Failed!', error)
                    this.error = error
                    this.user = null
                })
        },
        signOut() {
            getAuth().signOut().then(() => {
                this.user = null
                this.error = null
            })
        }
    }

})