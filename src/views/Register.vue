<template>
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
                  v-model="email"
                  class="input"
                  type="text"
                  autocomplete="email"
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  class="input"
                  type="password"
                  autocomplete="current-password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Repeat password</label>
              <div class="control">
                <input
                  v-model="passwordRepeat"
                  class="input"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div class="field">
              <p class="control">
                <button @click.prevent="validate()" class="button is-success">
                  Register
                </button>
              </p>
            </div>
          </form>
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
      passwordRepeat: null as string | null,
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
      if (!(this.password === this.passwordRepeat)) {
        this.validationErrors.push('<strong>Passwords</strong> did not match')
      }

      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signUp()
      }
    },
    signUp () {
      // @TODO signUn logic will come here
      console.log('sign up', this.email, this.password)
    }
  }
})
</script>
