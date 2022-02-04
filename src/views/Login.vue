<template>
  <div><login-form /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginForm from '../components/LoginForm.vue'

export default defineComponent({
  components: {
    LoginForm
  },
  setup () {
    return {}
  }
})
</script>
