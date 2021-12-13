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

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TableView from './TableView.vue'
import StatView from './StatView.vue'
import SimilarGraph from './SimilarGraph.vue'
import api from '../utils/api'
import Sql from '../utils/sql'
import { PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'SqlView',
  components: {
    TableView,
    StatView,
    SimilarGraph
  },
  props: {
    view: String,
    sql: String,
    ids: {} as PropType<Array<PaperID>>,
    emptyMessage: String
  },
  emits: ['results'],
  data () {
    return {
      results: [] as any[][],
      errorMsg: undefined as string | undefined,
      loading: true
    }
  },
  created (): void {
    this.runSQL()
  },
  computed: {
    filters (): Record<string, string | undefined> {
      return {
        keywords: this.$route.query.keywords?.toString(),
        maxYear: this.$route.query.maxYear?.toString(),
        minYear: this.$route.query.minYear?.toString(),
        maxDistance: this.$route.query.maxDistance?.toString(),
        minDistance: this.$route.query.minDistance?.toString()
      }
    },
    filteredSql (): string {
      return Sql.addFilters(this.sql ?? '', this.filters)
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
    runSQL (): void {
      if (this.ids && this.filteredSql) {
        this.errorMsg = undefined
        this.loading = true

        api
          .queryGraph(this.ids, this.filteredSql)
          .then(response => {
            this.results = response
            this.loading = false
            this.emitter.emit('graph_loaded')
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
