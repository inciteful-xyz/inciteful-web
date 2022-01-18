<template>
  <v-tour
    :name="name"
    :steps="steps"
    :callbacks="callbacks"
    :options="{ highlight: true }"
  ></v-tour>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
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
    if (this.name && localStorage[this.name]) {
      this.sawTour = true
    }
  },
  watch: {
    ready (newVal, oldVal) {
      if (newVal && !oldVal) {
        if (!this.sawTour && this.name) {
          this.sawTour = localStorage[this.name] = true
          // @ts-ignore
          this.$tours[this.name].start()
        }
      }
    }
  },
  methods: {
    finish () {
      let ele = document.getElementById('body')
      if (ele) {
        ele.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
})
</script>
<style lang="scss">
.v-step {
  @apply bg-purple-600 #{!important};
}
</style>
