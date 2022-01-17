<template>
  <div>
    <div class="min-h-full flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          v-if="validationErrors.length"
          class="rounded-md bg-red-50 p-8 mb-8 shadow"
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

        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" action="#" method="POST">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
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

    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <div class="card">
          <div class="card-content">
            <div
              v-if="validationErrors.length"
              class="notification is-danger is-light"
            >
              <button @click="resetError()" class="delete"></button>
              <div class="content">
                Please resolve the following error(s) before proceeding.
                <ul style="margin-top:0.3em; margin-left: 1em">
                  <li
                    v-for="(error, index) in validationErrors"
                    :key="`error-${index}`"
                    v-html="error"
                  />
                </ul>
              </div>
            </div>
            <form>
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    autocomplete="email"
                    v-model="email"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    autocomplete="current-password"
                    v-model="password"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div class="field">
                <p class="control">
                  <button @click.prevent="validate()" class="button is-success">
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      email: null as string | null,
      password: null as string | null,
      validationErrors: [] as Array<string>
    }
  },
  methods: {
    resetError () {
      this.validationErrors = []
    },
    validate () {
      // Clear the errors before we validate again
      this.resetError()

      // email validation
      if (!this.email) {
        this.validationErrors.push('<strong>E-mail</strong> cannot be empty.')
      }
      if (this.email && /.+@.+/.test(this.email) !== true) {
        this.validationErrors.push('<strong>E-mail</strong> must be valid.')
      }
      // password validation
      if (!this.password) {
        this.validationErrors.push('<strong>Password</strong> cannot be empty')
      }
      if (this.password && /.{6,}/.test(this.password) !== true) {
        this.validationErrors.push(
          '<strong>Password</strong> must be at least 6 characters long'
        )
      }
      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signIn()
      }
    },
    signIn () {
      // @TODO signIn logic will come here
      console.log('sign in', this.email, this.password)
      this.$router.back()
    }
  }
})
</script>
