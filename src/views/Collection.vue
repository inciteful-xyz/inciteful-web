<template>
  <div>
    <single-column>
      <div v-if="!collection">
        Invalid ID or you do not have permission to access the collection.
      </div>
      <div v-else>
        <div v-if="collection.papers.length > 0">
          <BetaFeatures />
          <div class="border-b border-gray-200 pb-6 mb-6">
            Manager
          </div>
          <div class="border-b border-gray-200 pb-6 mb-6">
            <graph-filters :hideAddSinble="false" />
          </div>
          <div>
            <DashboardRenderer :template="template" :ids="ids" />
          </div>
        </div>
        <div v-else>
          There are not papers added to this collection. Please use the paper
          discovery tool or the Zotero connection manger to get papers into the
          collection.
        </div>
      </div>
    </single-column>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import GraphFilters from '../components/GraphFilters.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import DashboardRenderer from '../components/DashboardRenderer.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_paper_template.json'
import { useRoute } from 'vue-router'
import { usePaperCollectionStore } from '@/stores/paperCollectionStore'

export default defineComponent({
  name: 'Collection',
  components: {
    GraphFilters,
    DashboardRenderer,
    BetaFeatures,
    SingleColumn
  },
  setup () {
    const pcStore = usePaperCollectionStore()
    const route = useRoute()
    const collectionId = route.params.pathMatch as string

    const collection = computed(() => {
      return pcStore.getPaperCollection(collectionId)
    })

    const ids = computed(() => {
      return collection.value?.papers.map(p => p.paperId)
    })

    return {
      template,
      collection,
      ids
    }
  }
})
</script>
