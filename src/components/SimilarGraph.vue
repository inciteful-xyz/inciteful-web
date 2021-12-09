<template>
  <div>
    <GraphView v-if="graphData" :errorMsg="errorMsg" :graphData="graphData" />
    <loader v-else />
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../utils/api'
import GraphView from './GraphView'
import Loader from './Loader.vue'

export default Vue.extend({
  name: 'SimilarGraph',
  components: {
    GraphView,
    Loader
  },
  props: {
    results: Array,
    errorMsg: String,
    sourceIds: Array,
    loading: {
      type: Boolean,
      default () {
        return true
      }
    },
    emptyMessage: String
  },
  data () {
    return {
      papers: undefined,
      papersLoaded: false
    }
  },
  computed: {
    ids () {
      if (this.hasPaperID()) {
        return this.results.map(r => r.paper_id)
      }
      return []
    },
    sourcePaperId () {
      if (
        this.sourceIds &&
        this.sourceIds.length === 1 &&
        Number.parseInt(this.sourceIds[0])
      ) {
        return Number.parseInt(this.sourceIds[0])
      }
      return undefined
    },
    graphData () {
      if (this.papersLoaded && !this.loading) {
        return {
          papers: this.papers,
          sourcePaperId: this.sourcePaperId,
          type: 'similar',
          modalOptions: {
            connectTo: this.sourcePaperId
              ? this.sourcePaperId.toString()
              : undefined
          }
        }
      } else {
        return undefined
      }
    }
  },
  watch: {
    results () {
      if (!this.hasPaperID() && !this.loading) {
        this.errorMsg = 'SQL must be a list of `paper_id`s'
      } else {
        this.papersLoaded = false
        this.papers = []
        api.getPapers(this.ids).then(data => {
          this.papers = data
          this.papersLoaded = true
        })
      }
    }
  },
  methods: {
    hasPaperID () {
      return (
        this.results &&
        this.results.length > 0 &&
        this.results[0].paper_id !== undefined
      )
    }
  }
})
</script>
