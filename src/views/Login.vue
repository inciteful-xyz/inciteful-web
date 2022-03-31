<template>
  <single-column>
    <login-form @success="success" />
  </single-column>
</template>

<script lang="ts">
import SingleColumn from '@/components/layout/SingleColumn.vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'

export default defineComponent({
  components: {
    LoginForm,
    SingleColumn
  },
  setup () {
    const router = useRouter()
    return {
      success: () => router.push('/user')
    }
  }
})
</script>
