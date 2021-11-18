<template>
  <div>
    <GraphView v-if="graphData" :errorMsg="errorMsg" :graphData="graphData" />
    <loader v-else />
  </div>
</template>

<script>
import api from '../utils/api'
import GraphView from './GraphView'
import Loader from './Loader.vue'

export default {
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
      loaded: false
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
      if (this.loaded) {
        return {
          papers: this.papers,
          sourcePaperId: this.sourcePaperId,
          type: 'similar',
          modalOptions: { connectTo: this.sourcePaperId.toString() }
        }
      } else {
        return undefined
      }
    }
  },
  watch: {
    results (newVal, oldVal) {
      if (!this.hasPaperID() && !this.loading) {
        this.errorMsg = 'SQL must be a list of `paper_id`s'
      } else {
        this.loaded = false
        this.papers = []
        api.getPapers(this.ids).then(data => {
          this.papers = data
          this.loaded = true
        })
      }
    }
  },
  methods: {
    hasPaperID () {
      return this.results.length > 0 && this.results[0].paper_id !== undefined
    }
  }
}
</script>
