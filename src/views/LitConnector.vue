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
          <ArrowRightIcon class="w-12 h-12 hidden sm:inline" />
          <ArrowDownIcon class="w-12 h-12 sm:hidden m-auto" />
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
    <lit-connector-tour :ready="pageReady" />
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BetaSignup from '../components/BetaSignup.vue'
import LitConnectorPaperSelector from '../components/LitConnectorPaperSelector.vue'
import LitConnectorBody from '../components/LitConnectorBody.vue'
import Faq from '../components/Faq.vue'
import LitConnectorTour from '../components/LitConnectorTour.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import { Paper } from '@/types/incitefulTypes'
import { ArrowRightIcon, ArrowDownIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'LitConnectorPage',
  components: {
    BetaSignup,
    LitConnectorPaperSelector,
    LitConnectorBody,
    Faq,
    LitConnectorTour,
    SingleColumn,
    ArrowRightIcon,
    ArrowDownIcon
  },
  data () {
    return {
      pageReady: false,
      toParam: null as string | null,
      to: undefined as Paper | undefined,
      fromParam: null as string | null,
      from: undefined as Paper | undefined,
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
    this.emitter.on('graph_loaded', () => {
      this.pageReady = true
    })
  },
  created () {
    if (this.$route.query.to) {
      this.toParam = this.$route.query.to.toString()
    }
    if (this.$route.query.from) {
      this.fromParam = this.$route.query.from.toString()
    }
  },
  computed: {
    isValid (): boolean {
      return this.to !== undefined && this.from !== undefined
    }
  },
  watch: {
    '$route.query.to' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.toParam = newVal ? newVal.toString() : null
      }
    },
    '$route.query.from' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fromParam = newVal ? newVal.toString() : null
      }
    }
  },
  methods: {
    handleFromSelect (paper: Paper | undefined) {
      if (paper !== undefined) {
        this.from = paper
        if (paper && this.fromParam !== paper.id) {
          this.$router.push({ query: { ...this.$route.query, from: paper.id } })
        }
      }
    },
    handleToSelect (paper: Paper | undefined) {
      if (paper !== undefined) {
        this.to = paper
        if (this.toParam !== paper.id) {
          this.$router.push({
            query: { ...this.$route.query, to: paper.id }
          })
        }
      }
    }
  }
})
</script>
