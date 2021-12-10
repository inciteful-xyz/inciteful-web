<template>
  <button
    v-if="!isHidden"
    class="
      add-paper-button
      font-extrabold
      text-sm
      rounded-full
      h-5
      w-5
      bg-purple-500
      text-white
      justify-center
    "
    title="Add paper to a literature review search"
    v-on:click="addToLitReview()"
  >
    +
  </button>
</template>

<script lang="ts">
import { PaperID } from '@/types/inciteful'
import Vue, { PropType } from 'vue'
import bus from '../utils/bus'

export default Vue.extend({
  name: 'LitReviewButton',
  props: {
    ids: {} as PropType<PaperID[]>,
    id: {} as PropType<PaperID[] | undefined>
  },
  data () {
    return {
      isSubmitted: false,
      idsToHide: [] as PaperID[]
    }
  },
  computed: {
    isHidden (): boolean {
      return !this.id || this.idsToHide.indexOf(this.id.toString()) !== -1
    }
  },
  mounted () {
    bus.$on('add_to_lit_review', (id: PaperID) => {
      this.idsToHide.push(id)
    })
  },
  created () {
    if (this.ids) {
      this.ids.forEach(id => this.idsToHide.push(id))
    }
  },
  methods: {
    addToLitReview (): void {
      if (this.id) {
        bus.$emit('add_to_lit_review', this.id.toString())
      }
    }
  }
})
</script>
