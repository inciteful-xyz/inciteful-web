<template>
  <single-column>
    <BetaFeatures />
    <div class="pb-3">
      <div class="border-b border-gray-200 pb-6 mb-6">
        <PaperHero :paper="paper" paperId="id" :graphStats="true" />
      </div>
    </div>
    <QueryPanel :sql="$route.query.sql" :ids="ids" />
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PaperHero from '../components/PaperHero.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import QueryPanel from '../components/QueryPanel.vue'
import api from '../utils/api'
import SingleColumn from '../components/layout/SingleColumn.vue'
import { Paper, PaperID } from '@/types/incitefulTypes'

export default defineComponent({
  name: 'PaperDiscoveryQuery',
  components: {
    PaperHero,
    QueryPanel,
    BetaFeatures,
    SingleColumn
  },
  data() {
    return {
      paper: undefined as Paper | undefined
    }
  },
  computed: {
    id(): PaperID {
      return this.$route.params.pathMatch as string
    },
    ids(): PaperID[] {
      return [this.id]
    }
  },
  mounted() {
    this.setData(this.id)
  },
  watch: {
    '$route.params.pathMatch'(val) {
      this.setData(val)
    }
  },
  methods: {
    setData(id: PaperID): void {
      if (id) {
        api.getPaper(id).then(data => {
          this.paper = data

          if (this.paper && this.paper.id != id) {
            this.$router.replace({
              name: 'PaperDiscoveryQuery',
              params: { pathMatch: this.paper.id }
            })
          }
        })
      } else {
        this.paper = undefined
      }
    }
  }
})
</script>
