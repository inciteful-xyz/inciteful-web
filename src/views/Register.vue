<template>
  <single-column><register-form @success="success"/></single-column>
</template>

<script lang="ts">
import SingleColumn from '@/components/layout/SingleColumn.vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'

export default defineComponent({
  components: {
    RegisterForm,
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
