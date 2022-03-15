<template>
  <div><register-form @success="success" /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'

export default defineComponent({
  components: {
    RegisterForm
  },
  setup () {
    const router = useRouter()
    return {
      success: () => router.push('/user')
    }
  }
})
</script>
