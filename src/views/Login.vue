<template>
  <div><login-form @success="success" /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'

export default defineComponent({
  components: {
    LoginForm
  },
  setup () {
    const router = useRouter()
    return {
      success: () => router.push('/user')
    }
  }
})
</script>
