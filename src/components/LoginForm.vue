<template>
  <div class="my-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        v-if="validationErrors.length"
        class="rounded-md bg-red-50 p-6 mb-6 shadow"
      >
        Please resolve the following error(s) before proceeding.
        <div class="mt-2 text-sm text-red-700">
          <ul role="list" class="list-disc pl-5 space-y-1">
            <li
              v-for="(error, index) in validationErrors"
              :key="`error-${index}`"
              v-html="error"
            />
          </ul>
        </div>
      </div>

      <div class="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                v-model="email"
                placeholder="example@email.com"
                autocomplete="email"
                required=""
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                v-model="password"
                autocomplete="current-password"
                required=""
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              @click.prevent="validate()"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign in
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a
                href="/forgot"
                class="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useUserStore } from '../stores/user'

export default defineComponent({
  name: 'LoginForm',
  emits: ['success'],
  setup (_prop, { emit }) {
    const userStore = useUserStore()

    let email = ref(null as string | null)
    let password = ref(null as string | null)
    let validationErrors = ref([] as Array<string>)

    const signIn = () => {
      if (email.value && password.value) {
        userStore
          .signInWithEmailAndPassword(email.value, password.value)
          .then(() => {
            if (userStore.user) {
              emit('success')
            } else if (userStore.error) {
              validationErrors.value.push(userStore.error.message)
            }
          })
      }
    }

    const resetError = () => {
      validationErrors.value = []
    }

    const validate = () => {
      // Clear the errors before we validate again
      resetError()

      // email validation
      if (!email.value) {
        validationErrors.value.push('<strong>E-mail</strong> cannot be empty.')
      }
      if (email.value && /.+@.+/.test(email.value) !== true) {
        validationErrors.value.push('<strong>E-mail</strong> must be valid.')
      }
      // password validation
      if (!password.value) {
        validationErrors.value.push('<strong>Password</strong> cannot be empty')
      }
      if (password.value != null && /.{6,}/.test(password.value) !== true) {
        validationErrors.value.push(
          '<strong>Password</strong> must be at least 6 characters long'
        )
      }
      // when valid then sign in
      if (validationErrors.value.length <= 0) {
        signIn()
      }
    }

    return {
      email,
      password,
      validationErrors,
      resetError,
      validate
    }
  }
})
</script>
