<template>
  <button
    v-if="!isHidden"
    title="Add paper to a literature review search"
    v-on:click="addToLitReview()"
  >
    <PlusCircleIcon class="h-5 w-5 text-purple-500 inline" />
  </button>
</template>

<script lang="ts">
import { PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
import { PlusCircleIcon } from '@heroicons/vue/solid'
export default defineComponent({
  name: 'LitReviewButton',
  components: { PlusCircleIcon },
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
    this.emitter.on('add_to_lit_review', (id: PaperID) => {
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
        this.emitter.emit('add_to_lit_review', this.id.toString())
      }
    }
  }
})
</script>
