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

<script>
import Vue from 'vue'
import api from '../utils/api'
import PaperHero from './PaperHero'
import GraphView from './GraphView'

export default Vue.extend({
  name: 'PaperModalContent',
  components: {
    PaperHero,
    GraphView
  },
  data () {
    return {
      paper: undefined,
      connectingResults: undefined,
      loaded: false
    }
  },
  props: {
    paperId: Number,
    connectTo: String,
    options: Object
  },
  computed: {
    graphData () {
      return {
        type: 'connector',
        papers: this.connectingResults.papers,
        connections: this.connectingResults.connections,
        paths: this.connectingResults.paths,
        toId: this.paperId,
        fromId: this.connectTo,
        modalOptions: {
          previousScreen: {
            options: this.options
          },
          connectTo: this.connectTo
        }
      }
    }
  },
  mounted () {
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
    goToLitConnector () {
      this.$router.push({
        name: 'LitConnector',
        query: {
          to: this.graphData.toId,
          from: this.graphData.fromId
        }
      })
    }
  }
})
</script>
