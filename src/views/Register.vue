<template>
  <div><register-form /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RegisterForm from '../components/RegisterForm.vue'

export default defineComponent({
  components: {
    RegisterForm
  },
  setup () {
    return {}
  }
})
</script>
