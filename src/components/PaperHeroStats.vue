<template>
  <dl
    class="text-center sm:mx-auto flex flex-wrap gap-2 sm:gap-4 sm:text-lg text-sm mt-3 sm:mt-4"
  >
    <div class="flex flex-1" id="paper-stats">
      <stat>
        <template v-slot:name>Cited By</template>
        <template v-slot:value> {{ numCitedBy }}</template>
      </stat>
      <stat>
        <template v-slot:name>Citing</template>
        <template v-slot:value> {{ numCiting }}</template>
      </stat>
      <stat>
        <template v-slot:name>Published</template>
        <template v-slot:value> {{ publishedYear }}</template>
      </stat>
      <stat>
        <template v-slot:name>Open Access</template>
        <template v-slot:value
          ><a
            v-if="oaLink"
            :href="oaLink"
            target="_blank"
            class="underline hover:no-underline"
            >Yes</a
          ><span v-else-if="loading">-</span><span v-else>No</span></template
        >
      </stat>
    </div>
    <div v-if="graphStats" class="flex flex-1" id="graph-stats">
      <stat>
        <template v-slot:name>Papers in Graph</template>
        <template v-slot:value>
          <SqlView
            :view="'stat'"
            :sql="`SELECT value FROM metadata WHERE name = 'paper_count'`"
            :ids="[id]"
        /></template>
      </stat>
      <stat>
        <template v-slot:name>Citations in Graph</template>
        <template v-slot:value>
          <SqlView
            :view="'stat'"
            :sql="`SELECT value FROM metadata WHERE name = 'citation_count'`"
            :ids="[id]"
        /></template>
      </stat>
      <Stat>
        <template v-slot:name>Graph Depth</template>
        <template v-slot:value>
          <SqlView
            :view="'stat'"
            :sql="`SELECT value FROM metadata WHERE name = 'graph_depth'`"
            :ids="[id]"
          />
        </template>
      </Stat>
    </div>
  </dl>
</template>

<script>
import Vue from 'vue'
import api from '../utils/api'
import SqlView from './SqlView'
import Stat from './Stat.vue'

export default Vue.extend({
  name: 'PaperHeroStats',
  components: {
    SqlView,
    Stat
  },
  data () {
    return {
      oaLink: undefined,
      loading: true
    }
  },
  props: {
    numCitedBy: Number,
    numCiting: Number,
    publishedYear: Number,
    id: String,
    doi: String,
    graphStats: { type: Boolean, default: false }
  },
  watch: {
    doi: {
      handler (val) {
        this.queryOA(val)
      }
    }
  },
  created () {
    this.queryOA(this.doi)
  },
  methods: {
    queryOA (doi) {
      if (doi) {
        api.unpaywall(doi).then(data => {
          this.loading = false
          if (data && data.best_oa_location) {
            this.oaLink = data.best_oa_location.url
          }
        })
      } else {
        this.loading = false
      }
    }
  }
})
</script>
