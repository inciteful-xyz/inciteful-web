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
<script lang="ts">
import { defineComponent } from 'vue'
import GraphFilters from '../components/GraphFilters.vue'
import LitReviewBuilder from '../components/LitReviewBuilder.vue'
import LitReviewHero from '../components/LitReviewHero.vue'

import PaperInfoModal from '../components/PaperInfoModal.vue'
import BetaSignup from '../components/BetaSignup.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import DashboardRenderer from '../components/DashboardRenderer.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_paper_template.json'
import PaperDiscoveryEmpty from '../components/PaperDiscoveryEmpty.vue'
import { PaperID } from '@/types/inciteful'

export default defineComponent({
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
      ids: undefined as undefined | PaperID[]
    }
  },
  created () {
    if (this.$route.query.ids !== undefined) {
      this.ids = this.$route.query.ids as PaperID[]
    }
    // @ts-ignore
    this.$watch(() => this.$route.query.ids, this.idsChanged)
  },
  methods: {
    idsChanged (val: PaperID[]): void {
      this.ids = val
    }
  }
})
</script>
