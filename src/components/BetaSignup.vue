<template>
  <div
    class="px-6 py-6 bg-purple-700 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center"
  >
    <div v-if="isSubmitted" class="text-center">
      <h2
        class="text-2xl leading-8 font-extrabold tracking-tight text-white sm:text-3xl sm:leading-9"
      >
        Thanks for signing up and we look forward to working with you!
      </h2>
    </div>
    <div class="xl:w-0 xl:flex-1" v-if="!isSubmitted">
      <h2
        class="text-2xl leading-8 font-extrabold tracking-tight text-white sm:text-3xl sm:leading-9"
      >
        Want to be a beta tester?
      </h2>
      <p
        class="mt-3 max-w-3xl text-lg leading-6 text-purple-200"
        id="newsletter-headline"
      >
        Inciteful is changing every day. Stay up to date, get early access to
        new features, and have a say in what we develop.
      </p>
    </div>
    <div class="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8" v-if="!isSubmitted">
      <form
        class="sm:flex"
        aria-labelledby="newsletter-headline"
        @submit.prevent="handleSubmit"
      >
        <input
          ref="emailInput"
          aria-label="Email address"
          type="email"
          required
          class="appearance-none w-full px-5 py-3 border border-transparent text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out"
          placeholder="Enter your email"
        />
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button
            class="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:bg-purple-400 transition duration-150 ease-in-out"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'BetaSignup',
  data () {
    return {
      isSubmitted: false
    }
  },
  methods: {
    handleSubmit () {
      axios
        .create({
          transformRequest: [(data, _headers) => JSON.stringify(data)]
        })
        .post('https://hooks.zapier.com/hooks/catch/3747051/olkz0jl/silent/', {
          email: this.$refs.emailInput.value
        })

      this.isSubmitted = true
    }
  }
})
</script>
