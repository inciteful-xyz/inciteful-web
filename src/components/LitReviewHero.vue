<template>
  <div class="text-sm">
    <h1 v-if="showTitle">
      Seed Papers
    </h1>
    <div v-if="ids && ids.length < 5" class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-5">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationIcon class="h-5 w-5 text-amber-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm leading-5 text-amber-700">
            When creating your own graph recommend you have at least five seed
            papers to ensure quality results.
          </p>
        </div>
      </div>
    </div>
    <PaperList @remove-paper="removePaper" :ids="ids"></PaperList>
  </div>
</template>

<script lang="ts">
import { PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'
import PaperList from './PaperList.vue'

import { ExclamationIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/userStore'

let user = useUserStore()

export default defineComponent({
  name: 'LitReviewHero',
  props: {
    ids: {} as PropType<PaperID[]>,
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['remove-paper'],
  components: {
    ExclamationIcon,
    PaperList
  },
  data() {
    return {
      numVisible: 5,
    }
  },
  computed: {
    userEnabled(): boolean {
      return user.enabled
    },
  },
  methods: {
    removePaper(removeId: PaperID): void {
      if (this.ids === undefined) return

      const ids = this.ids
        .filter(id => id !== removeId)

      this.$router.push({
        query: {
          ids: ids
        }
      })
    },
  }
})
</script>
