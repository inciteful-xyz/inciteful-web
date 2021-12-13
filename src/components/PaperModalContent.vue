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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import api from '../utils/api'
import PaperHero from './PaperHero.vue'
import GraphView from './GraphView.vue'
import { GraphData, Paper, PaperConnector, PaperID } from '@/types/inciteful'

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
    paperId: {} as PropType<PaperID>,
    connectTo: String,
    options: Object
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
        toId: this.paperId,
        fromId: this.connectTo,
        modalOptions: {
          previousScreen: this.options,
          connectTo: this.connectTo
        }
      }
    }
  },
  mounted (): void {
    if (!this.paperId) {
      this.paper = undefined
    } else {
      api.getPaper(this.paperId).then(paper => (this.paper = paper))
    }
    if (this.connectTo) {
      this.loaded = false
      api.connectPapers(this.connectTo, this.paperId, true).then(results => {
        this.connectingResults = results
        this.loaded = true
      })
    } else {
      this.connectingResults = undefined
    }
  },
  watch: {
    paperId () {
      if (!this.paperId) {
        this.paper = undefined
      } else {
        api.getPaper(this.paperId).then(paper => (this.paper = paper))
      }
    },
    connectTo () {
      if (this.connectTo) {
        this.loaded = false
        api.connectPapers(this.connectTo, this.paperId, true).then(results => {
          this.connectingResults = results
          this.loaded = true
        })
      } else {
        this.connectingResults = undefined
      }
    }
  },
  methods: {
    goToLitConnector (): void {
      if (this.graphData) {
        this.$router.push({
          name: 'LitConnector',
          query: {
            to: this.graphData.toId?.toString(),
            from: this.graphData.fromId?.toString()
          }
        })
      }
    }
  }
})
</script>
