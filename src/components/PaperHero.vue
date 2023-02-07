<template>
  <div v-if="paper" class="text-sm">
    <div id="paper-info">
      <h1>
        <favorite-paper-button :id="paper.id" />
        <span v-html="paper.title" class="pl-1"></span>
      </h1>
      <div class="lg:flex lg:flex-row-reverse">
        <div class="flex-1 lg:text-right mt-2">
          <span v-if="paper.journal" class="italic">{{ paper.journal }}</span
          ><span v-if="paper.volume">, vol {{ paper.volume }}</span
          ><span v-if="paper.doi"> &nbsp;|&nbsp; DOI: {{ paper.doi }}</span>
        </div>
        <div class="flex-1 mt-2 text-gray-500 font-semibold">
          <authors
            :authors="paper.author"
            :separator="' | '"
            :showAll="true"
            :ids="[paper.id]"
          />
        </div>
      </div>
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 sm:mt-6"
        v-if="!receivedLoaded && graphStats"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm leading-5 text-yellow-700">
              Constructing and analyzing a graph takes time. If it's not cached
              it may take up to a minute for the graph to load. Please be
              patient.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <PaperHeroStats
        :numCitedBy="paper.num_cited_by"
        :numCiting="paper.num_citing"
        :publishedYear="paper.published_year"
        :id="paper.id"
        :doi="paper.doi"
        :graphStats="graphStats"
      />
    </div>

    <div class="pt-2 sm:pt-4 lg:flex">
      <div class="text-xs lg:flex-none">
        Links:
        <external-links :paper="paper" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import PaperHeroStats from './PaperHeroStats.vue'
import ExternalLinks from './ExternalLinks.vue'
import FavoritePaperButton from './FavoritePaperButton.vue'
import Authors from './Authors.vue'
import { Paper } from '@/types/incitefulTypes'
import { ExclamationIcon } from '@heroicons/vue/outline'
import { EmitEvents } from '@/utils/emitHelpers'

export default defineComponent({
  name: 'PaperHero',
  props: {
    paper: {} as PropType<Paper>,
    graphStats: { type: Boolean, default: false }
  },
  components: {
    PaperHeroStats,
    Authors,
    ExternalLinks,
    ExclamationIcon,
    FavoritePaperButton
  },
  data() {
    return {
      receivedLoaded: false
    }
  },
  watch: {
    paper() {
      this.receivedLoaded = false
    }
  },
  mounted() {
    this.emitter.on(EmitEvents.GraphLoaded, () => {
      this.receivedLoaded = true
    })
  }
})
</script>
