<template>
  <div>
    <div
      class="fixed bottom-4 sm:bottom-20 right-4 sm:right-10"
      v-if="ids.size > 0"
    >
      <span
        v-bind:class="[
          { 'animate-bounce': doBounce },
          'relative',
          'inline-flex',
          'rounded-md',
          'shadow-sm',
        ]"
      >
        <button
          class="inline-flex items-center rounded-lg bg-purple-700 hover:bg-purple-500 focus:outline-none focus:border-purple-700 text-white p-3"
          v-on:click="toLitReview()"
        >
          Add Papers ({{ ids.size }})
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import bus from '../utils/bus'
import navigation from '../navigation'

export default {
  name: 'LitReviewBuilder',
  data () {
    return {
      doBounce: false,
      ids: new Set()
    }
  },
  mounted () {
    bus.$on('add_to_lit_review', (id) => {
      if (!this.ids.has(id)) {
        this.ids.add(id)
        this.doBounce = true
        this.$forceUpdate()
        setTimeout(() => {
          this.doBounce = false
        }, 2500)
      }
    })
  },
  methods: {
    toLitReview () {
      navigation.addLitReviewPapers(Array.from(this.ids))
    }
  }
}
</script>
