<template>
  <div v-if="truncatedAbstract">
    {{ truncatedAbstract }}
    <button
      @click="toggleAbstractView()"
      v-if="canTruncate"
      class="underline hover:no-underline text-purple-700"
    >
      <span v-if="truncateAbstract"
        ><svg
          class="w-4 h-4 inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
          ></path>
        </svg>
        more</span
      ><span v-if="!truncateAbstract"
        ><svg
          class="w-4 h-4 inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 11l7-7 7 7M5 19l7-7 7 7"
          ></path>
        </svg>
        less</span
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AbstractView',
  props: {
    abstract: String,
    length: Number
  },
  data () {
    return {
      truncateAbstract: true
    }
  },
  methods: {
    toggleAbstractView (): void {
      this.truncateAbstract = !this.truncateAbstract
    }
  },
  computed: {
    canTruncate (): boolean {
      return (this.abstract ?? '').length > this.shortenedLength
    },
    shortenedLength (): number {
      return this.length ? this.length : 550
    },
    truncatedAbstract (): string {
      if (!this.abstract) return ''

      const text = this.abstract.slice()

      if (!this.truncateAbstract || !this.canTruncate) return text

      const overflow = text.substr(this.shortenedLength)
      const firstSpace = overflow.indexOf(' ')
      return text.substr(0, this.shortenedLength + firstSpace) + '...'
    }
  }
})
</script>
