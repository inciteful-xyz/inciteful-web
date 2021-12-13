<template>
  <single-column>
    <BetaFeatures />
    <div class="border-b border-gray-200 pb-6 mb-6">
      <lit-review-hero :ids="this.$route.query.ids" />
    </div>

    <QueryPanel :sql="$route.query.sql" :ids="this.$route.query.ids" />
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LitReviewHero from '../components/LitReviewHero.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import QueryPanel from '../components/QueryPanel.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'

export default defineComponent({
  name: 'PaperDiscoveryQuery',
  components: {
    LitReviewHero,
    QueryPanel,
    BetaFeatures,
    SingleColumn
  }
})
</script>
