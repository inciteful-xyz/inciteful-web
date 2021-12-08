<template>
  <div>
    <single-column v-if="ids">
      <div>
        <BetaFeatures />
        <div class="border-b border-gray-200 pb-6 mb-6">
          <lit-review-hero :ids="ids" />
        </div>
        <div class="border-b border-gray-200 pb-6 mb-6">
          <graph-filters :hideAddSinble="false" />
        </div>
        <div>
          <DashboardRenderer :template="template" :ids="ids" />
        </div>
        <div class="pb-6"><BetaSignup /></div>
      </div>
      <LitReviewBuilder />
      <PaperInfoModal />
    </single-column>
    <paper-discovery-empty v-else />
  </div>
</template>
<script>
import Vue from 'vue'
import GraphFilters from '../components/GraphFilters'
import LitReviewBuilder from '../components/LitReviewBuilder'
import LitReviewHero from '../components/LitReviewHero'

import PaperInfoModal from '../components/PaperInfoModal'
import BetaSignup from '../components/BetaSignup'
import BetaFeatures from '../components/BetaFeatures'
import DashboardRenderer from '../components/DashboardRenderer'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_paper_template.json'
import PaperDiscoveryEmpty from '../components/PaperDiscoveryEmpty.vue'

export default Vue.extend({
  name: 'LitReview',
  components: {
    GraphFilters,
    PaperInfoModal,
    LitReviewBuilder,
    LitReviewHero,
    BetaSignup,
    DashboardRenderer,
    BetaFeatures,
    SingleColumn,
    PaperDiscoveryEmpty
  },
  data () {
    return {
      template,
      ids: undefined
    }
  },
  created () {
    this.ids = this.$route.query.ids
    this.$watch(() => this.$route.query.ids, this.idsChanged)
  },
  methods: {
    idsChanged (val) {
      this.ids = val
    }
  }
})
</script>
