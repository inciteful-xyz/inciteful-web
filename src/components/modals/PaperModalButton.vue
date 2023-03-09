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
import { PaperID } from '@/types/incitefulTypes'
import { PaperModalOptions } from '@/types/modalTypes'
import { showModalHelper } from '@/utils/emitHelpers'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'PaperModalButton',
  props: {
    contextIds: {} as PropType<PaperID[]>,
    connectTo: {} as PropType<PaperID>,
    id: {} as PropType<PaperID>,
    text: {} as PropType<string>,
    class: {} as PropType<string[]>
  },
  data() {
    return {
      isSubmitted: false
    }
  },
  methods: {
    showModal(): void {
      if (this.id) {
        const options: PaperModalOptions = {
          paperId: this.id,
          connectTo: undefined as undefined | PaperID
        }

        if (this.contextIds && this.contextIds.length === 1) {
          options.connectTo = this.contextIds[0]
        }

        if (this.connectTo) {
          options.connectTo = this.connectTo
        }
        showModalHelper(options)
      }
    }
  },
  computed: {
    isHidden(): boolean {
      return !this.id
    }
  }
})
</script>
