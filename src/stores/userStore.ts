
import { defineStore } from 'pinia'
import { UserData } from '../types/userTypes';
import { PaperID } from '../types/incitefulTypes';

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: () => {
        return {
            userDataDoc: undefined as UserData | undefined,
            enabled: process.env.VUE_APP_SHOW_LOGIN == "true"
        }
    },
    actions: {
        async saveUser(user: UserData) {
            throw new Error("Not implemented")
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
        async addFavorite(id: PaperID) {
            await this.addFavorites([id])
        },
        async addFavorites(ids: PaperID[]) {
            this.awaitUserDataLoad(async () => {
                if (this.userDataDoc) {
                    throw new Error("Not implemented")
                }
            })
        },
        async removeFavorite(id: PaperID) {
            this.awaitUserDataLoad(async () => {
                if (this.userDataDoc) {
                    throw new Error("Not implemented")
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
            return state.userDataDoc
        },
        isSignedIn(state): boolean {
            return false
        },
        userName(state): string | undefined {
            throw new Error("Not implemented")
        },
        userId(state): string | undefined {
            throw new Error("Not implemented")
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