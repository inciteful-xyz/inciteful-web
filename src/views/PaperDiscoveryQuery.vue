<template>
  <single-column>
    <BetaFeatures />
    <div class="pb-3">
      <div class="border-b border-gray-200 pb-6 mb-6">
        <PaperHero :paper="paper" :graphStats="true" />
      </div>
    </div>
    <QueryPanel :sql="$route.query.sql" :ids="ids" />
  </single-column>
</template>
<script>
import PaperHero from '../components/PaperHero'
import BetaFeatures from '../components/BetaFeatures'
import QueryPanel from '../components/QueryPanel'
import api from '../utils/api'
import SingleColumn from '../components/layout/SingleColumn.vue'

export default {
  name: 'PaperDiscoveryQuery',
  components: {
    PaperHero,
    QueryPanel,
    BetaFeatures,
    SingleColumn
  },
  data () {
    return {
      paper: undefined
    }
  },
  computed: {
    ids () {
      return [this.$route.params.pathMatch]
    }
  },
  mounted () {
    this.setData(this.$route.params.pathMatch)
  },
  watch: {
    '$route.params.pathMatch' (val) {
      this.setData(val)
    }
  },
  methods: {
    setData (id) {
      if (id) {
        api.getPaper(id).then(data => {
          this.paper = data
        })
      } else {
        this.paper = undefined
      }
    }
  }
}
</script>
