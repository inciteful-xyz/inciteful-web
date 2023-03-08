<template>
  <div>
    <single-column v-if="ids">
      <div>
        <ZoteroAnnouncement />
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
        <div class="pb-6">
          <BetaSignup />
        </div>
      </div>
    </single-column>
    <paper-discovery-empty v-else />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import GraphFilters from '../components/GraphFilters.vue'
import LitReviewHero from '../components/LitReviewHero.vue'
import BetaSignup from '../components/BetaSignup.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import DashboardRenderer from '../components/DashboardRenderer.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_paper_template.json'
import PaperDiscoveryEmpty from '../components/PaperDiscoveryEmpty.vue'
import { PaperID } from '@/types/incitefulTypes'
import navigation from '@/navigation'
import ZoteroAnnouncement from '@/components/announcements/ZoteroAnnouncement.vue';

export default defineComponent({
  name: 'LitReview',
  components: {
    GraphFilters,
    LitReviewHero,
    BetaSignup,
    DashboardRenderer,
    BetaFeatures,
    SingleColumn,
    PaperDiscoveryEmpty,
    ZoteroAnnouncement
  },
  data() {
    return {
      template,
      ids: undefined as undefined | PaperID[]
    }
  },
  created() {
    const ids = this.$route.query.ids as PaperID[] | undefined
    if (ids !== undefined) {
      if (ids.length === 1) {
        this.$router.push({
          path: navigation.getPaperUrl(ids[0])
        })
      }

      this.ids = this.$route.query.ids as PaperID[]
    }

    this.$watch(() => this.$route.query.ids, this.idsChanged)
  },
  methods: {
    idsChanged(val: PaperID[]): void {
      if (val && val.length === 1) {
        this.$router.push({
          path: navigation.getPaperUrl(val[0]),
          query: undefined,
        })
      }

      this.ids = val
    }
  }
})
</script>
