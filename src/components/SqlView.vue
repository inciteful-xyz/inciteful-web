<template>
  <div>
    <span v-if="view == 'stat'">
      <StatView :results="results" :errorMsg="errorMsg" :loading="loading" />
    </span>
    <div v-else-if="view == 'graph'">
      <SimilarGraph
        :results="results"
        :errorMsg="errorMsg"
        :sql="filteredSql"
        :loading="loading"
        :sourceIds="ids"
        :emptyMessage="emptyMessage"
      />
    </div>
    <div v-else>
      <TableView
        :results="results"
        :errorMsg="errorMsg"
        :sql="filteredSql"
        :loading="loading"
        :ids="ids"
        :emptyMessage="emptyMessage"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TableView from './TableView.vue'
import StatView from './StatView.vue'
import SimilarGraph from './SimilarGraph'
import api from '../utils/api'
import Sql from '../utils/sql'
import bus from '../utils/bus'

export default Vue.extend({
  name: 'SqlView',
  components: {
    TableView,
    StatView,
    SimilarGraph
  },
  props: {
    view: String,
    sql: String,
    ids: Array,
    emptyMessage: String
  },
  data () {
    return {
      results: [],
      errorMsg: undefined,
      loading: true,
      bus
    }
  },
  created () {
    this.runSQL()
  },
  computed: {
    filters () {
      return {
        keywords: this.$route.query.keywords,
        maxYear: this.$route.query.maxYear,
        minYear: this.$route.query.minYear,
        maxDistance: this.$route.query.maxDistance,
        minDistance: this.$route.query.minDistance
      }
    },
    filteredSql () {
      return Sql.addFilters(this.sql, this.filters)
    },
    columns () {
      if (this.results) {
        return this.getColumnNames(this.results)
      }

      return undefined
    }
  },
  watch: {
    ids (val, oldVal) {
      if (val !== oldVal) {
        this.runSQL()
      }
    },
    filteredSql (val, oldVal) {
      if (val !== oldVal) {
        this.runSQL()
      }
    }
  },
  methods: {
    runSQL () {
      if (this.ids && this.filteredSql) {
        this.errorMsg = undefined
        this.loading = true

        api
          .queryGraph(this.ids, this.filteredSql)
          .then(response => {
            this.results = response
            this.loading = false
            this.bus.$emit('graph_loaded')
            this.$emit('results', this.results)
          })
          .catch(error => {
            this.errorMsg = error
          })
      }
    }
  }
})
</script>
