<template>
  <button
    v-if="!isHidden"
    v-on:click="showModal"
    class="underline"
    :class="$props.class"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'PaperModalButton',
  props: {
    contextIds: {} as PropType<PaperID[]>,
    connectTo: {} as PropType<PaperID>,
    id: {} as PropType<PaperID[]>,
    text: {} as PropType<string>,
    class: {} as PropType<string[]>
  },
  data () {
    return {
      isSubmitted: false
    }
  },
  methods: {
    showModal (): void {
      const options = {
        paperId: this.id,
        connectTo: undefined as undefined | PaperID
      }

      if (this.contextIds && this.contextIds.length === 1) {
        options.connectTo = this.contextIds[0]
      }

      if (this.connectTo) {
        options.connectTo = this.connectTo
      }

      this.emitter.emit('show_paper_modal', options)
    }
  },
  computed: {
    isHidden (): boolean {
      return !this.id
    }
  }
})
</script>
