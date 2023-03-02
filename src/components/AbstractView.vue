<template>
  <div v-if="truncatedAbstract">
    {{ truncatedAbstract }}
    <button
      @click="toggleAbstractView()"
      v-if="canTruncate"
      class="underline hover:no-underline text-violet-700"
    >
      <span v-if="truncateAbstract"
        ><ChevronDoubleDownIcon class="h-4 w-4 inline-block" /> more</span
      ><span v-if="!truncateAbstract"
        ><ChevronDoubleUpIcon class="h-4 w-4 inline-block" /> less</span
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon
} from '@heroicons/vue/outline'
export default defineComponent({
  name: 'AbstractView',
  components: {
    ChevronDoubleUpIcon,
    ChevronDoubleDownIcon
  },
  props: {
    abstract: String,
    length: Number
  },
  data() {
    return {
      truncateAbstract: true
    }
  },
  methods: {
    toggleAbstractView(): void {
      this.truncateAbstract = !this.truncateAbstract
    }
  },
  computed: {
    canTruncate(): boolean {
      return (this.abstract ?? '').length > this.shortenedLength
    },
    shortenedLength(): number {
      return this.length ? this.length : 550
    },
    truncatedAbstract(): string {
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
