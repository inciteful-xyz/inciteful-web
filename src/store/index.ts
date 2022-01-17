
import { getAuth, createUserWithEmailAndPassword, User, AuthError } from 'firebase/auth'

export type UserState = {
  user: null | User;
  error: null | AuthError;
}
const initialState = (): UserState => {
  return { user: null as null | User, error: null as null | AuthError }
}

const userModule = {
  namespaced: true,
  state: initialState(),
  mutations: {
    setUser (state: UserState, user: User) {
      state.user = user
    },
    setError (state: UserState, error: AuthError) {
      state.error = error
    }
  },
  actions: {
    signUp (state: UserState, email: string, password: string) {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          // Signed in
          // const user = userCredential.user
          console.log('Success! ', userCredential)
          state.user = userCredential.user
        })
        .catch(error => {
          // const errorCode = error.code
          // const errorMessage = error.message
          console.log('Failed!', error)
          state.error = error
        })
    }
  }
}

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  state: initialState(),
  mutations: {},
  actions: {},
  getters: {},
  modules: { userModule }
})
