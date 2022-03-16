<template>
  <div>
    <PaperHero :paper="paper" :paperId="paperId" />
    <div v-if="this.connectingResults" class="text-right">
      <GraphView :graphData="graphData" :loaded="loaded" />
      <button
        v-on:click="goToLitConnector()"
        class="text-xs hover:underline text-purple-600"
      >
        View in Literature Connector >>
      </button>
    </div>
    <div class="flex whitespace-nowrap pt-6">
      <div class="sm:flex-1 hidden sm:flex">
        <span class="inline-flex rounded-md shadow-sm">
          <button v-on:click="back()" class="button-gray">
            Back
          </button>
        </span>
      </div>
      <div class="flex-1 sm:text-center">
        <span class="inline-flex rounded-md shadow-sm">
          <button v-on:click="goToPaper" class="button-light-purple">
            Go to Graph
          </button>
        </span>
      </div>
      <div class="flex-1 text-right">
        <span class="inline-flex rounded-md shadow-sm">
          <button v-on:click="addToLitReview()" class="button-purple">
            Add to Lit Review
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import api from '../utils/api'
import PaperHero from './PaperHero.vue'
import GraphView from './GraphView.vue'
import { Paper, PaperConnector } from '@/types/incitefulTypes'
import navigation from '../navigation'
import { PaperModalOptions } from '@/types/modalTypes'
import { GraphData } from '@/types/graphTypes'

export default defineComponent({
  name: 'PaperModalContent',
  components: {
    PaperHero,
    GraphView
  },
  data () {
    return {
      paper: undefined as Paper | undefined,
      connectingResults: undefined as PaperConnector | undefined,
      loaded: false
    }
  },
  props: {
    options: Object() as PropType<PaperModalOptions>
  },
  computed: {
    graphData (): GraphData | undefined {
      const type = 'connector'

      if (this.connectingResults === undefined) {
        return undefined
      }

      return {
        type,
        papers: this.connectingResults.papers,
        connections: this.connectingResults.connections,
        paths: this.connectingResults.paths,
        toId: this.options?.paperId,
        fromId: this.options?.connectTo,
        modalOptions: {
          previousScreen: this.options,
          connectTo: this.options?.connectTo
        }
      }
    }
  },
  mounted (): void {
    if (!this.options?.paperId) {
      this.paper = undefined
    } else {
      api.getPaper(this.options.paperId).then(paper => (this.paper = paper))
    }
    if (this.options?.connectTo) {
      this.connectPapers(this.options.connectTo, this.options.paperId)
    } else {
      this.connectingResults = undefined
    }
  },
  watch: {
    paperId (newVal: string, oldVal: string) {
      if (!this.options) {
        this.paper = undefined
      } else if (newVal !== oldVal) {
        api.getPaper(this.options.paperId).then(paper => (this.paper = paper))
        if (this.options.connectTo) {
          this.connectPapers(this.options.connectTo, this.options.paperId)
        }
      }
    },
    connectTo (newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        if (this.options?.connectTo) {
          this.connectPapers(this.options.connectTo, this.options.paperId)
        } else {
          this.connectingResults = undefined
        }
      }
    }
  },
  emits: ['clearModal', 'back'],
  methods: {
    connectPapers (from: string, to: string): void {
      this.loaded = false
      api.connectPapers(from, to, false).then(results => {
        this.connectingResults = results
        this.loaded = true
      })
    },
    goToLitConnector (): void {
      if (this.graphData) {
        this.$router.push({
          name: 'LitConnector',
          query: {
            to: this.graphData.toId?.toString(),
            from: this.graphData.fromId?.toString()
          }
        })
        this.$emit('clearModal')
      }
    },
    addToLitReview (): void {
      if (this.options !== undefined) {
        this.emitter.emit('add_to_lit_review', this.options.paperId)
        this.back()
      }
    },
    goToPaper (): void {
      if (this.options !== undefined) {
        this.$router.push({
          path: navigation.getPaperUrl(this.options.paperId)
        })

        this.$emit('clearModal')
      }
    },
    back (): void {
      this.$emit('back')
    }
  }
})
</script>
