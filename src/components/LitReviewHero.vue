<template>
  <div class="text-sm">
    <h1>
      Seed Papers
    </h1>
    <div
      v-if="ids && ids.length < 5"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-5"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationIcon class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm leading-5 text-yellow-700">
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
import { Paper, PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'
import api from '../utils/incitefulApi'
import PaperList from './PaperList.vue'

import { ExclamationIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/userStore'

let user = useUserStore()

export default defineComponent({
  name: 'LitReviewHero',
  props: {
    ids: {} as PropType<PaperID[]>
  },
  emits: ['remove-paper'],
  components: {
    ExclamationIcon,
    PaperList
  },
  data() {
    return {
      papers: undefined as Paper[] | undefined,
      numVisible: 5,
      hidePapers: true
    }
  },
  created() {
    if (this.ids) {
      this.setData(this.ids)
    }
  },
  computed: {
    userEnabled(): boolean {
      return user.enabled
    },
    visiblePapers(): Paper[] {
      if (this.papers) {
        return this.papers.slice(
          0,
          this.hidePapers ? this.numVisible : this.papers.length
        )
      }
      return []
    }
  },
  watch: {
    ids: {
      handler(val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData(ids: PaperID[]): void {
      if (ids) {
        api.getPapers(ids, true).then(data => {
          this.papers = data

          // If any of the ids are different, update the url
          var origIds = ids.slice().sort()
          var newIds = this.papers
            .map(p => p.id)
            .slice()
            .sort()

          if (
            origIds.length !== newIds.length ||
            origIds.some((val, index) => val !== newIds[index])
          ) {
            this.$router.push({
              query: {
                ids: newIds
              }
            })
          }
        })
      } else {
        this.papers = undefined
      }
    },
    removePaper(removeId: PaperID): void {
      if (this.papers === undefined) return

      const ids = this.papers
        .filter(paper => paper.id !== removeId)
        .map(paper => paper.id)

      this.$router.push({
        query: {
          ids: ids
        }
      })
    },
    togglePaperView(): void {
      this.hidePapers = !this.hidePapers
    }
  }
})
</script>
