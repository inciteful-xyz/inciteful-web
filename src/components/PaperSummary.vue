<template>
  <div>
    <div v-if="paper">
      <paper-modal-button
        :text="paper.title"
        :id="paper.id"
        class="underline block font-semibold pb-2 text-left"
      />
      <div v-if="paper.author" class="font-semibold text-gray-500">
        <Authors :authors="paper.author" :ids="ids" />
      </div>
      <span>
        <i>{{ paper.journal }}</i
        >{{ paper.published_year && paper.journal ? ',' : '' }}
        {{ paper.published_year ? `${paper.published_year}` : '' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Authors from './Authors.vue'
import { Paper, PaperID } from '@/types/inciteful'
import PaperModalButton from './PaperModalButton.vue'

export default defineComponent({
  components: { Authors, PaperModalButton },
  name: 'PaperCard',
  props: {
    paper: {} as PropType<Paper>
  },
  computed: {
    ids (): PaperID[] {
      if (this.paper) {
        return [this.paper.id]
      } else return []
    }
  }
})
</script>
