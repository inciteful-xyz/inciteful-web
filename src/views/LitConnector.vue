<template>
  <single-column>
    <div v-if="!isValid">
      <div class="bg-white">
        <div class="max-w-full mx-auto pb-12">
          <div
            class="
              bg-purple-700
              rounded-lg
              shadow-xl
              overflow-hidden
              lg:grid lg:grid-cols-2
              lg:gap-4
            "
          >
            <div
              class="
                pt-5
                pb-6
                px-3
                sm:pt-8
                sm:px-8
                lg:py-8
                lg:pr-0
                xl:py-10
                xl:px-10
              "
            >
              <div class="lg:self-center text-lg leading-6">
                <h2
                  class="
                    text-3xl
                    leading-9
                    font-extrabold
                    text-white
                    sm:text-4xl
                    sm:leading-10
                  "
                >
                  <span class="block">Literature Connector</span>
                </h2>
                <p class="mt-3 text-purple-200">
                  Interested in interdisciplinary studies? Use our tool to
                  discover how two bodies of literature connect to one another.
                </p>
                <p class="mt-3 text-purple-200">
                  When you enter two papers it will show you the shortest paths
                  between the papers, allow you to interact with the graph, as
                  well as search and filter through the papers. Then send those
                  papers over to our Discovery tool to find other relevant
                  literature.
                </p>
              </div>
            </div>
            <div class="relative pb-3/5 -mt-6 md:pb-1/2">
              <img
                class="
                  absolute
                  inset-0
                  w-full
                  h-full
                  transform
                  translate-x-6 translate-y-6
                  rounded-md
                  object-cover object-left-top
                  sm:translate-x-16
                  lg:translate-y-20
                "
                src="../assets/images/connector-graph.png"
                alt="App screenshot"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <div class="sm:flex mb-6" id="connected-papers">
        <div class="flex-1 sm:pr-3">
          <lit-connector-paper-selector
            ref="fromSelector"
            :paperParam="fromParam"
            :searchLabel="'From'"
            @paperSelected="handleFromSelect"
          />
        </div>
        <div class="flex-none text-center py-3 sm:py-6">
          <svg
            class="w-12 h-12 hidden sm:inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
          <svg
            class="w-12 h-12 sm:hidden m-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
        <div class="flex-1 sm:pl-3">
          <lit-connector-paper-selector
            ref="toSelector"
            :paperParam="toParam"
            :searchLabel="'To'"
            @paperSelected="handleToSelect"
          />
        </div>
      </div>
      <lit-connector-body :to="to" :from="from" />
    </div>

    <faq v-if="!isValid" :faqs="faqs" />
    <BetaSignup />
    <LitReviewBuilder />
    <PaperInfoModal />
    <lit-connector-tour :ready="pageReady" />
  </single-column>
</template>
<script>
import LitReviewBuilder from '../components/LitReviewBuilder'
import BetaSignup from '../components/BetaSignup'
import LitConnectorPaperSelector from '../components/LitConnectorPaperSelector.vue'
import LitConnectorBody from '../components/LitConnectorBody.vue'
import PaperInfoModal from '../components/PaperInfoModal'
import Faq from '../components/Faq.vue'
import LitConnectorTour from '../components/LitConnectorTour.vue'
import bus from '../utils/bus'
import SingleColumn from '../components/layout/SingleColumn.vue'

export default {
  name: 'LitConnectorPage',
  components: {
    PaperInfoModal,
    LitReviewBuilder,
    BetaSignup,
    LitConnectorPaperSelector,
    LitConnectorBody,
    Faq,
    LitConnectorTour,
    SingleColumn
  },
  data () {
    return {
      pageReady: false,
      toParam: undefined,
      to: undefined,
      fromParam: undefined,
      from: undefined,
      faqs: [
        {
          question: 'How are the links made between papers?',
          answer:
            'A link is established through citations. Two papers are linked if either one cites the other. So starting from the seed paper we recursively search through all the papers that are cited by the seed paper or that which cite the seed paper.'
        },
        {
          question: 'How many hops will it search?',
          answer:
            "The largest number of hops right now is six but I have honestly not found two papers that are more than five away. Obviously at that point the relevance of the search is called into question. But it's still fun to play around with it."
        },
        {
          question: "Can I use multiple papers in my 'from' or 'to'?",
          answer:
            "Not right now.  I am still working through what it means to show the 'paths' between two groups of papers. Stay tuned though."
        },
        {
          question:
            'Can I connect the papers by anything but the shortest path?',
          answer:
            "Again, not right now.  I'm playing with the idea of showing the shortest paths as well as other 'important' paths.  But defining 'important' is hard and the number of paths grows exponentially once you go one level beyond the shortest path and so it's hard to visualize."
        }
      ]
    }
  },
  mounted () {
    bus.$on('graph_loaded', () => {
      this.pageReady = true
    })
  },
  created () {
    this.toParam = this.$route.query.to
    this.fromParam = this.$route.query.from
  },
  computed: {
    isValid () {
      return this.to && this.from
    }
  },
  methods: {
    handleFromSelect (paper, newParam) {
      if (paper) {
        this.from = paper
      }

      if (parseInt(this.fromParam) !== paper.id) {
        this.$router.push({ query: { ...this.$route.query, from: paper.id } })
      }
    },
    handleToSelect (paper, newParam) {
      if (paper) {
        this.to = paper
      }
      if (parseInt(this.toParam) !== paper.id) {
        this.$router.push({ query: { ...this.$route.query, to: paper.id } })
      }
    }
  }
}
</script>
