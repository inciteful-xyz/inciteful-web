<template>
  <div>
    <h1 class="text-lg font-bold text-gray-800 leading-tight lg:text-2xl pr-3">
      Other graph papers by {{ author.name }}
    </h1>
    <sql-view :ids="ids" :sql="sql" />
  </div>
</template>

<script>
import api from '../utils/api'
import SqlView from './SqlView.vue'

export default {
  name: 'AuthorModalContent',
  components: {
    SqlView
  },
  props: {
    author: Object,
    ids: Array,
    options: Object
  },
  computed: {
    sql () {
      return `SELECT paper_id, doi, authors, title, published_year, num_cited_by\nFROM papers p\nWHERE {{filters}} AND p.paper_id IN (SELECT paper_id FROM authors WHERE author_id = ${this.author.author_id}) ORDER BY published_year DESC`
    },
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
}
</script>
