
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, getIdTokenResult, IdTokenResult, AuthError, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { defineStore } from 'pinia'
import '@/plugins/firebase'

const auth = getAuth()

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: () => {
        const auth = getAuth()

        return {
            user: auth.currentUser,
            error: null as null | AuthError,
            token: null as null | IdTokenResult,
            enabled: process.env.VUE_APP_SHOW_LOGIN == "true"
        }
    },
    actions: {
        async signUpWithEmailAndPassword(email: string, password: string) {
            return createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    // Signed in
                    this.user = userCredential.user
                    this.error = null
                })
                .catch(error => {
                    this.error = error
                    this.user = null
                })
        },
        async signInWithEmailAndPassword(email: string, password: string) {
            return signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    this.user = userCredential.user
                    this.error = null
                    this.token = await getIdTokenResult(userCredential.user);
                })
                .catch(error => {
                    this.error = error
                    this.user = null
                    this.token = null
                })
        },
        signOut() {
            getAuth().signOut()
        },
        async bindUser() {
            onAuthStateChanged(
                auth,
                async (user) => {
                    this.user = user;
                    if (user) {
                        this.token = await getIdTokenResult(user);
                        this.user = user
                        this.error = null
                    }
                },
            );
        },
        async sendPasswordResetEmail(email: string) {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // Password reset email sent!
                    // ..
                })
                .catch((error) => {
                    this.error = error
                });
        }
    },
    getters: {
        isSignedIn(state): boolean {
            return state.user !== null
        },
        userName(state): string | null {
            return state.user ? state.user.email : null;
        },
        initial(): string | null {
            return (this.userName && this.userName.length > 0 ? this.userName[0].toUpperCase() : null)
        }
    },
})