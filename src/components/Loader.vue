<template>
  <div class="max-w-full">
    <div class="w-28 m-auto">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Loader',
  data () {
    return {}
  }
})
</script>

<style lang="scss">
.loader {
  border: 16px solid rgba(172, 148, 250, 1); /* Light grey */
  border-top: 16px solid #730cc75b; /* Blue */
  border-bottom: 16px solid #730cc75b; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
