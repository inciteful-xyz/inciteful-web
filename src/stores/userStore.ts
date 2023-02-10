
import { onAuthStateChanged, createUserWithEmailAndPassword, getIdTokenResult, IdTokenResult, AuthError, signInWithEmailAndPassword, sendPasswordResetEmail, User } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, usersCol } from '@/plugins/firebase'
import { UserData } from '../types/userTypes';
import { doc, DocumentSnapshot, setDoc, Unsubscribe, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { PaperID } from '../types/incitefulTypes';

// avoid null value before initialization from async onAuthStateChanged
const storageId = 'firebase:uid';
type OnChangeFn = (userId: string | undefined) => Promise<((() => void) | undefined)>;

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: () => {
        return {
            firebaseAuthUser: auth.currentUser,
            userDataDoc: undefined as DocumentSnapshot<UserData> | undefined,
            error: null as null | AuthError,
            jwt: null as null | IdTokenResult,
            enabled: process.env.VUE_APP_SHOW_LOGIN == "true",
            unsubs: undefined as undefined | (Unsubscribe | undefined)[]
        }
    },
    actions: {
        async saveUser(user: UserData) {
            await setDoc(doc(usersCol, user.id), user)
        },
        async setStateFromFirebaseUser(user: User | null) {
            this.firebaseAuthUser = user;

            if (user) {
                localStorage.setItem(storageId, user.uid);
                this.jwt = await getIdTokenResult(user);
                this.error = null
            } else {
                localStorage.removeItem(storageId);
                this.jwt = null
            }
        },
        async signUpWithEmailAndPassword(email: string, password: string) {
            return createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    this.setStateFromFirebaseUser(userCredential.user);
                })
                .catch(error => {
                    this.error = error
                    this.setStateFromFirebaseUser(null);
                })
        },
        async signInWithEmailAndPassword(email: string, password: string) {
            return signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    this.setStateFromFirebaseUser(userCredential.user)
                })
                .catch(error => {
                    this.error = error
                    this.setStateFromFirebaseUser(null)
                })
        },
        signOut() {
            this.unsubs?.forEach(u => {
                if (u) u()
            })

            this.unsubs = undefined

            auth.signOut()
        },
        async bindToUserLoad(executeOnChange: OnChangeFn[]) {
            executeOnChange.push(this.bind)

            onAuthStateChanged(
                auth,
                async (user) => {
                    this.setStateFromFirebaseUser(user)
                    this.unsubs = (await Promise.all(executeOnChange.map(x => x(user?.uid)))).flatMap(x => x)
                },
            );
        },
        async bind(userId: string | undefined) {
            if (userId) {
                const unsub = onSnapshot(doc(usersCol, userId), (doc) => {
                    if (!doc.exists() || !this.firebaseAuthUser) {
                        this.saveUser({ id: userId, favoritePapers: [] })
                    }

                    this.userDataDoc = doc
                });

                return (() => {
                    unsub()
                    this.userDataDoc = undefined
                })
            }
        },
        async awaitUserDataLoad(f: () => void) {
            if (this.isSignedIn) {
                if (this.userDataDoc) {
                    f()
                } else {
                    setTimeout(() => this.awaitUserDataLoad(f), 100)
                }
            }
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
        },
        async addFavorite(id: PaperID) {
            await this.addFavorites([id])
        },
        async addFavorites(ids: PaperID[]) {
            this.awaitUserDataLoad(async () => {
                if (this.userDataDoc) {
                    await updateDoc(this.userDataDoc.ref, {
                        favoritePapers: arrayUnion(...ids)
                    });
                }
            })
        },
        async removeFavorite(id: PaperID) {
            this.awaitUserDataLoad(async () => {
                if (this.userDataDoc) {
                    await updateDoc(this.userDataDoc.ref, {
                        favoritePapers: arrayRemove(id)
                    });
                }
            })
        },
        async toggleFavorite(id: PaperID) {
            if (!this.isPaperFavorite(id))
                this.addFavorite(id)
            else
                this.removeFavorite(id)
        }
    },
    getters: {
        userData(state) {
            return state.userDataDoc?.data()
        },
        isSignedIn(state): boolean {
            return state.firebaseAuthUser !== null || localStorage[storageId]
        },
        userName(state): string | undefined {
            return state.firebaseAuthUser ? state.firebaseAuthUser.email ?? 'anonymous' : undefined;
        },
        userId(state): string | undefined {
            return (state.firebaseAuthUser || localStorage[storageId]) ? (state.firebaseAuthUser?.uid ?? localStorage[storageId]) : undefined;
        },
        initial(): string | undefined {
            return (this.userName && this.userName.length > 0 ? this.userName[0].toUpperCase() : undefined)
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