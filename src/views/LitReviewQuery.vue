<template>
  <single-column>
    <BetaFeatures />
    <div class="border-b border-gray-200 pb-6 mb-6">
      <lit-review-hero :ids="ids" />
    </div>

    <QueryPanel :sql="$route.query.sql" :ids="ids" />
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LitReviewHero from '../components/LitReviewHero.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import QueryPanel from '../components/QueryPanel.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import { PaperID } from '@/types/incitefulTypes'

function ensureArray(val: unknown): PaperID[] | undefined {
  if (val === undefined || val === null) return undefined
  if (Array.isArray(val)) return val as PaperID[]
  return [val as PaperID]
}

export default defineComponent({
  name: 'PaperDiscoveryQuery',
  components: {
    LitReviewHero,
    QueryPanel,
    BetaFeatures,
    SingleColumn
  },
  computed: {
    ids(): PaperID[] | undefined {
      return ensureArray(this.$route.query.ids)
    }
  }
})
</script>
