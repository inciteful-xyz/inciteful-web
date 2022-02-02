
import { onAuthStateChanged, createUserWithEmailAndPassword, getIdTokenResult, IdTokenResult, AuthError, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, usersCol } from '@/plugins/firebase'
import { User } from '../types/user';
import { doc, setDoc } from 'firebase/firestore';

// avoid null value before initialization from async onAuthStateChanged
const storageId = 'firebase:uid';
type OnChangeFn = (userId: string | undefined) => Promise<void>;

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: () => {
        return {
            user: auth.currentUser,
            userData: undefined as undefined | User,
            error: null as null | AuthError,
            token: null as null | IdTokenResult,
            enabled: process.env.VUE_APP_SHOW_LOGIN == "true"
        }
    },
    actions: {
        async saveUser(user: User) {
            await setDoc(doc(usersCol, user.id), user)
        },
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
            auth.signOut()
        },
        async bindUser(executeOnChange: OnChangeFn[]) {
            onAuthStateChanged(
                auth,
                async (user) => {
                    this.user = user;
                    if (user) {
                        localStorage.setItem(storageId, user.uid);
                        this.token = await getIdTokenResult(user);
                        this.user = user
                        this.error = null
                    } else {
                        localStorage.removeItem(storageId);
                    }

                    console.log("changed")
                    await Promise.all(executeOnChange.map(x => x(user?.uid)))
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
            return state.user !== null || localStorage[storageId]
        },
        userName(state): string | null {
            return state.user ? state.user.email : null;
        },
        userId(state): string | null {
            return state.user ? state.user.uid : null;
        },
        initial(): string | null {
            return (this.userName && this.userName.length > 0 ? this.userName[0].toUpperCase() : null)
        }
    },
})