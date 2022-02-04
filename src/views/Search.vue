<template>
  <single-column>
    <div class="min-h-full align-top text-sm">
      <h1 class="text-xl sm:text-lg font-semibold">
        Search Results for "{{ query }}"
      </h1>
      <div class="lg:flex lg:flex-row-reverse pt-4">
        <div>
          <div
            class="bg-white overflow-hidden shadow rounded-lg lg:ml-8 my-4 lg:my-0"
          >
            <div class="px-4 lg:w-72">
              <ul class="divide-y divide-gray-200">
                <li class="py-4">
                  Use the <LitReviewButton /> button to add multiple papers to
                  the graph. You can also use the "View Graph" button or click
                  on the title to go directly to that paper's graph.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex-grow">
          <search-results
            :showLitReviewButton="true"
            @selected="handleSelect"
            :query="query"
          />
        </div>
      </div>
    </div>
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LitReviewButton from '../components/LitReviewButton.vue'
import SearchResults from '../components/SearchResults.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import navigation from '../navigation'
import { Paper } from '@/types/inciteful'

export default defineComponent({
  name: 'SearchPage',
  components: {
    LitReviewButton,
    SearchResults,
    SingleColumn
  },
  data () {
    return {
      query: undefined as string | undefined,
      errorMsg: undefined as string | undefined,
      emptyMessage:
        'Your search returned no results, please try a different query.'
    }
  },
  created () {
    const q = this.$route.query.q as string | null

    if (!q) {
      this.errorMsg = 'Please enter a search term.'
    } else {
      this.query = q
    }
  },
  watch: {
    '$route.query.q' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.query = newVal
      }
    }
  },
  methods: {
    handleSelect (paper: Paper): void {
      this.$router.push({
        path: navigation.getPaperUrl(paper.id)
      })
    }
  }
})
</script>
