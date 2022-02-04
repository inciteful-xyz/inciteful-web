<template>
  <div class="my-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Create an account
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
      <div class="bg-white pb-6 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6 pt-8" action="#" method="POST">
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
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
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
              Confirm Password
            </label>
            <div class="mt-1">
              <input
                id="passwordRepeat"
                v-model="passwordRepeat"
                name="passwordRepeat"
                type="password"
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
              Register
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
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default defineComponent({
  setup () {
    const router = useRouter()
    const userStore = useUserStore()

    if (userStore.isSignedIn) {
      router.push('/')
    }

    let email = ref(null as string | null)
    let password = ref(null as string | null)

    let passwordRepeat = ref(null as string | null)
    let validationErrors = ref([] as Array<string>)

    const signUp = () => {
      // @TODO signIn logic will come here
      if (email.value && password.value) {
        userStore
          .signUpWithEmailAndPassword(email.value, password.value)
          .then(() => {
            if (userStore.user) {
              router.push('/')
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
      if (password.value && /.{6,}/.test(password.value) !== true) {
        validationErrors.value.push(
          '<strong>Password</strong> must be at least 6 characters long'
        )
      }
      if (!(password.value === passwordRepeat.value)) {
        validationErrors.value.push('<strong>Passwords</strong> do not match')
      }

      if (validationErrors.value.length <= 0) {
        signUp()
      }
    }

    return {
      email,
      password,
      passwordRepeat,
      validationErrors,
      resetError,
      validate
    }
  }
})
</script>
