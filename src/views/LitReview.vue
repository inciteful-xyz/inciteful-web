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
      </div>
    </single-column>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import GraphFilters from '../components/GraphFilters.vue'
import LitReviewHero from '../components/LitReviewHero.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import DashboardRenderer from '../components/DashboardRenderer.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_lr_template.yaml'
import { PaperID } from '@/types/incitefulTypes'
import navigation from '@/navigation'
import ZoteroAnnouncement from '@/components/announcements/ZoteroAnnouncement.vue'

function ensureArray(val: unknown): PaperID[] | undefined {
  if (val === undefined || val === null) return undefined
  if (Array.isArray(val)) return val as PaperID[]
  return [val as PaperID]
}

export default defineComponent({
  name: 'LitReview',
  components: {
    GraphFilters,
    LitReviewHero,
    DashboardRenderer,
    BetaFeatures,
    SingleColumn,
    ZoteroAnnouncement
  },
  data() {
    return {
      template,
      ids: undefined as undefined | PaperID[]
    }
  },
  created() {
    const ids = ensureArray(this.$route.query.ids)

    // Redirect to home if no ids provided
    if (ids === undefined) {
      this.$router.replace({ name: 'Home' })
      return
    }

    if (ids.length === 1) {
      this.$router.push({
        path: navigation.getPaperUrl(ids[0])
      })
      return
    }

    this.ids = ids

    this.$watch(() => this.$route.query.ids, this.idsChanged)
  },
  methods: {
    idsChanged(val: unknown): void {
      const ids = ensureArray(val)

      // Redirect to home if ids are removed
      if (!ids || ids.length === 0) {
        this.$router.replace({ name: 'Home' })
        return
      }

      if (ids.length === 1) {
        this.$router.push({
          path: navigation.getPaperUrl(ids[0]),
          query: undefined,
        })
        return
      }

      this.ids = ids
    }
  }
})
</script>
