<template>
  <v-tour
    :name="name"
    :steps="steps"
    :callbacks="callbacks"
    :options="{ highlight: true }"
  ></v-tour>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'PaperPageTour',
  props: {
    name: String,
    steps: Array,
    ready: Boolean
  },
  data () {
    return {
      sawTour: false,
      callbacks: {
        onSkip: this.finish,
        onFinish: this.finish
      }
    }
  },
  mounted: function () {
    if (localStorage[this.name]) {
      this.sawTour = true
    }
  },
  watch: {
    ready (newVal, oldVal) {
      if (newVal && !oldVal) {
        if (!this.sawTour) {
          this.sawTour = localStorage[this.name] = true
          this.$tours[this.name].start()
        }
      }
    }
  },
  methods: {
    finish () {
      document.getElementById('body').scrollIntoView({ behavior: 'smooth' })
    }
  }
})
</script>
<style lang="scss">
.v-step {
  @apply bg-purple-600 #{!important};
}
</style>
