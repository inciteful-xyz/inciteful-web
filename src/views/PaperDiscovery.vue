<template>
  <single-column>
    <BetaFeatures />
    <div class="border-b border-gray-200 pb-6 mb-6">
      <PaperHero :paper="paper" :paperId="id" :graphStats="true" />
    </div>
    <div v-if="paper && (paper.num_cited_by > 0 || paper.num_citing > 0)">
      <div class="border-b border-gray-200 pb-6 mb-6">
        <GraphFilters :hideAddSingle="false" />
      </div>
      <div class="border-l-4 border-blue-400 bg-blue-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0 pt-3">
            <svg
              class="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm leading-5 text-blue-700">
              Click on the purple plus signs (<span
                class="
                  font-extrabold
                  text-sm
                  rounded-full
                  h-5
                  w-5
                  bg-purple-500
                  text-white
                  justify-center
                "
              >
                + </span
              >) to add the most interesting papers to the graph. We recommend
              that you <b>add at least five papers to the graph</b> in order to
              find the most relevant results. If the papers below don't seem
              relevant, <b>use the keyword filter</b> to find the ones which
              are.
            </p>
            <p class="mt-3 text-sm leading-5 md:mt-0 md:ml-6 pt-3">
              <a
                href="https://help.inciteful.xyz/quick-start.html"
                target="_blank"
                class="
                  whitespace-nowrap
                  font-bold
                  text-blue-700
                  hover:text-blue-600
                  transition
                  ease-in-out
                  duration-150
                "
              >
                Learn More &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>
      <DashboardRenderer :template="template" :ids="ids" />
    </div>
    <div v-else class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            We could not construct the graph. We don't have records of any
            references or citations for this paper, which makes it kind of hard.
            Please search for another paper.
          </p>
        </div>
      </div>
    </div>
    <div class="pb-6"><BetaSignup /></div>

    <LitReviewBuilder />
    <PaperInfoModal />
    <PaperPageTour :ready="pageReady" />
  </single-column>
</template>
<script>
import Vue from 'vue'
import PaperHero from '../components/PaperHero'
import GraphFilters from '../components/GraphFilters'
import LitReviewBuilder from '../components/LitReviewBuilder'
import PaperInfoModal from '../components/PaperInfoModal'
import BetaSignup from '../components/BetaSignup'
import BetaFeatures from '../components/BetaFeatures'
import DashboardRenderer from '../components/DashboardRenderer'
import PaperPageTour from '../components/PaperPageTour'
import api from '../utils/api'
import bus from '../utils/bus'
import SingleColumn from '../components/layout/SingleColumn.vue'
import template from '../dashboard_templates/default_paper_template.json'
import pagedata from '../utils/pagedata'

export default Vue.extend({
  name: 'PaperDiscovery',
  components: {
    GraphFilters,
    PaperHero,
    PaperInfoModal,
    LitReviewBuilder,
    BetaSignup,
    DashboardRenderer,
    PaperPageTour,
    BetaFeatures,
    SingleColumn
  },
  data () {
    return {
      template,
      id: undefined,
      paper: undefined,
      pageReady: false
    }
  },
  computed: {
    ids () {
      return [this.id]
    }
  },
  created () {
    this.id = this.$route.params.pathMatch
    this.setData()
  },
  mounted () {
    bus.$on('graph_loaded', () => {
      this.pageReady = true
    })
  },
  watch: {
    '$route.params.pathMatch' (val) {
      this.id = val
    },
    id (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setData(newVal)
      }
    },
    paper (newVal) {
      if (newVal) {
        pagedata.setTitle(newVal.title)
      }
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
})
</script>
