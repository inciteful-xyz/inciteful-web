<template>
  <single-column>
    <BetaFeatures />
    <MedAnnouncement />
    <div class="border-b border-gray-200 pb-6 mb-6">
      <PaperHero :paper="paper" :graphStats="true" />
    </div>
    <div v-if="paper && (paper.num_cited_by > 0 || paper.num_citing > 0)">
      <div class="border-b border-gray-200 pb-6 mb-6">
        <GraphFilters :hideAddSingle="false" />
      </div>
      <div class="border-l-4 border-blue-400 bg-blue-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0 pt-3">
            <InformationCircleIcon class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm leading-5 text-blue-700">
              Click on the purple plus signs (
              <PlusCircleIcon class="h-5 w-5 text-violet-500 inline" />) to add the most interesting papers to the
              graph.
              We recommend
              that you <b>add at least five papers to the graph</b> in order to
              find the most relevant results. If the papers below don't seem
              relevant, <b>use the keyword filter</b> to find the ones which
              are.
            </p>
            <p class="mt-3 text-sm leading-5 md:mt-0 md:ml-6 pt-3">
              <a href="https://help.inciteful.xyz/quick-start.html" target="_blank" class="
                                                          whitespace-nowrap
                                                          font-bold
                                                          text-blue-700
                                                          hover:text-blue-600
                                                          transition
                                                          ease-in-out
                                                          duration-150
                                                        ">
                Learn More &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>
      <DashboardRenderer :template="template" :ids="ids" />
    </div>
    <div v-else class="bg-amber-50 border-l-4 border-amber-400 p-4 my-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationIcon class="h-5 w-5 text-amber-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-amber-700">
            We could not construct the graph. We don't have records of any
            references or citations for this paper, which makes it kind of hard.
            Please search for another paper.
          </p>
        </div>
      </div>
    </div>
    <div class="pb-6">
      <BetaSignup />
    </div>
    <PaperPageTour :ready="pageReady" />
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PaperHero from '../components/PaperHero.vue'
import GraphFilters from '../components/GraphFilters.vue'
import BetaSignup from '../components/BetaSignup.vue'
import BetaFeatures from '../components/BetaFeatures.vue'
import DashboardRenderer from '../components/DashboardRenderer.vue'
import PaperPageTour from '../components/PaperPageTour.vue'
import api from '../utils/incitefulApi'
import SingleColumn from '../components/layout/SingleColumn.vue'
import pagedata from '../utils/pagedata'
import { Paper, PaperID } from '@/types/incitefulTypes'
import { ExclamationIcon } from '@heroicons/vue/outline'
import { PlusCircleIcon, InformationCircleIcon } from '@heroicons/vue/solid'
import { EmitEvents } from '@/utils/emitHelpers'
import template from '../dashboard_templates/default_paper_template.yaml';
import MedAnnouncement from '@/components/announcements/MedAnnouncement.vue';

export default defineComponent({
  name: 'PaperDiscovery',
  components: {
    GraphFilters,
    PaperHero,
    BetaSignup,
    DashboardRenderer,
    PaperPageTour,
    BetaFeatures,
    SingleColumn,
    InformationCircleIcon,
    ExclamationIcon,
    PlusCircleIcon,
    MedAnnouncement
  },
  data() {
    return {
      template,
      id: undefined as PaperID | undefined,
      paper: undefined as Paper | undefined,
      pageReady: false
    }
  },
  computed: {
    ids(): PaperID[] {
      if (this.id !== undefined) {
        return [this.id]
      }
      return []
    }
  },
  created() {
    this.id = this.$route.params.pathMatch as string

    if (this.id !== undefined) {
      this.setData(this.id)
    }
  },
  mounted() {
    this.emitter.on(EmitEvents.GraphLoaded, () => {
      this.pageReady = true
    })
  },
  watch: {
    '$route.params.pathMatch'(val) {
      this.id = val
    },
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setData(newVal)
      }
    },
    paper(newVal) {
      if (newVal) {
        pagedata.setTitle(newVal.title)
      }
    }
  },
  methods: {
    setData(id: PaperID): void {
      if (id) {
        api.getPaper(id).then(data => {
          this.paper = data

          if (this.paper && this.paper.id != id) {
            this.$router.replace({
              name: 'PaperDiscovery',
              params: { pathMatch: this.paper.id }
            })
          }
        })
      } else {
        this.paper = undefined
      }
    }
  }
})
</script>
