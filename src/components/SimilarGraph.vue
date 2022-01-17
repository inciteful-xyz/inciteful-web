<template>
  <div>
    <GraphView v-if="graphData" :errorMsg="errorMsg" :graphData="graphData" />
    <loader v-else />
  </div>
</template>

<script lang="ts">
import { GraphData, Paper, PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
import api from '../utils/api'
import GraphView from './GraphView.vue'
import Loader from './Loader.vue'

export default defineComponent({
  name: 'SimilarGraph',
  components: {
    GraphView,
    Loader
  },
  props: {
    results: {} as PropType<Array<any>>,
    errorMsg: String,
    sourceIds: {} as PropType<Array<PaperID>>,
    loading: {
      type: Boolean,
      default: true
    },
    emptyMessage: String
  },
  data () {
    return {
      internalError: '',
      papers: [] as Paper[],
      papersLoaded: false
    }
  },
  computed: {
    ids (): Array<PaperID> {
      if (this.hasPaperID() && this.results) {
        return this.results.map(r => r.paper_id)
      }
      return []
    },
    sourcePaperId (): PaperID | undefined {
      if (this.sourceIds && this.sourceIds.length === 1) {
        return this.sourceIds[0]
      }
      return undefined
    },
    graphData (): GraphData | undefined {
      const type = 'similar'

      if (this.papersLoaded && !this.loading) {
        return {
          papers: this.papers,
          sourcePaperId: this.sourcePaperId,
          type,
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
    results (): void {
      if (!this.hasPaperID() && !this.loading) {
        this.internalError = 'SQL must be a list of `paper_id`s'
      } else {
        this.papersLoaded = false
        this.papers = []
        api.getPapers(this.ids, false).then(data => {
          this.papers = data
          this.papersLoaded = true
        })
      }
    }
  },
  methods: {
    hasPaperID (): boolean {
      return (
        (this.results &&
          this.results.length > 0 &&
          this.results[0].paper_id !== undefined) ??
        false
      )
    }
  }
})
</script>
