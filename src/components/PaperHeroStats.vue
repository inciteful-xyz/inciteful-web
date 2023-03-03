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
            :ids="id ? [id] : []"
        /></template>
      </stat>
      <stat>
        <template v-slot:name>Citations in Graph</template>
        <template v-slot:value>
          <SqlView
            :view="'stat'"
            :sql="`SELECT value FROM metadata WHERE name = 'citation_count'`"
            :ids="id ? [id] : []"
        /></template>
      </stat>
      <Stat>
        <template v-slot:name>Graph Depth</template>
        <template v-slot:value>
          <SqlView
            :view="'stat'"
            :sql="`SELECT value FROM metadata WHERE name = 'graph_depth'`"
            :ids="id ? [id] : []"
          />
        </template>
      </Stat>
    </div>
  </dl>
</template>

<script lang="ts">
import { PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'

import SqlView from './SqlView.vue'
import Stat from './Stat.vue'
import { getOAPaper } from '@/utils/openalexApi'

export default defineComponent({
  name: 'PaperHeroStats',
  components: {
    SqlView,
    Stat
  },
  data() {
    return {
      oaLink: undefined as undefined | string,
      loading: true
    }
  },
  props: {
    numCitedBy: Number,
    numCiting: Number,
    publishedYear: Number,
    id: {} as PropType<PaperID>,
    doi: String,
    graphStats: { type: Boolean, default: false }
  },
  watch: {
    id: {
      handler(val: PaperID) {
        this.queryOA(val)
      }
    }
  },
  created(): void {
    if (this.doi) {
      this.queryOA(this.doi)
    }
  },
  methods: {
    queryOA(id: PaperID): void {
      if (id) {
        getOAPaper(id).then(data => {
          this.loading = false
          if (data && data.open_access.is_oa) {
            this.oaLink = data.open_access.oa_url
          }
        })
      } else {
        this.loading = false
      }
    }
  }
})
</script>
