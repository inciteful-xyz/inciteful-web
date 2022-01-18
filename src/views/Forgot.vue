<template>
  <div class="min-h-full flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset Your Password
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
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    let email = ref(null as string | null)
    let validationErrors = ref([] as Array<string>)
    const userStore = useUserStore()

    const resetError = () => {
      validationErrors.value = []
    }
    const recover = () => {
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
      // when valid then sign in
      if (validationErrors.value.length <= 0) {
        recover()
      }
    }

    return {
      email,
      validationErrors,
      validate
    }
  }
})
</script>
