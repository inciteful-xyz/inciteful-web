<template>
  <single-column>
    <BetaFeatures />
    <div class="border-b border-gray-200 pb-6 mb-6">
      <lit-review-hero :ids="this.$route.query.ids" />
    </div>

    <QueryPanel :sql="$route.query.sql" :ids="this.$route.query.ids" />
  </single-column>
</template>
<script>
import LitReviewHero from '../components/LitReviewHero'
import BetaFeatures from '../components/BetaFeatures'
import QueryPanel from '../components/QueryPanel'
import SingleColumn from '../components/layout/SingleColumn.vue'

export default {
  name: 'PaperDiscoveryQuery',
  components: {
    LitReviewHero,
    QueryPanel,
    BetaFeatures,
    SingleColumn
  },
  data () {
    return {
      paper: undefined
    }
  }
}
</script>
