<template>
  <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 px-2 py-2 sm:py-5">
    <slot></slot>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'SingleColumn'
})
</script>
