<template>
  <single-column>
    <div>
      <div class="text-gray-800">
        <div class="mx-auto max-w-7xl lg:px-8">
          <div class="flex">
            <div class="flex-grow">
              <div>
                <h1
                  class="
                    text-3xl
                    tracking-tight
                    whitespace-nowrap
                    font-extrabold
                    sm:text-4xl
                    xl:text-5xl
                    flex flex-wrap
                  "
                >
                  <div class="block flex-none pr-2 xl:pr-3">Six Degrees of</div>
                  <div class="block flex-auto text-purple-400">
                    Albert Einstein
                  </div>
                </h1>
                <p
                  class="
                    mt-3
                    text-base text-gray-500
                    sm:text-xl
                    lg:text-lg
                    xl:text-xl
                  "
                >
                  Find out how many hops it takes to connect your paper to
                  Albert Einstein's 1905 paper establishing his Special Theory
                  of Relativity. Then obviously do the same with your friend's
                  papers to cement your bragging rights.
                </p>
                <div class="mt-5 sm:mt-8">
                  <lit-connector-paper-selector
                    ref="fromSelector"
                    :paperParam="toParam"
                    @paperSelected="handleToSelect"
                  />
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 md:pl-6 md:w-64 hidden md:block">
              <img
                v-if="minHops > 0"
                class="rounded-lg"
                src="../assets/images/einstein-tounge.jpg"
                alt=""
              />
              <img
                v-else
                class="rounded-lg"
                src="../assets/images/einstein-tounge.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="lg:pt-8 pt-5">
        <div
          v-if="minHops"
          class="
            bg-gray-800
            shadow
            sm:rounded-lg
            max-w-3xl
            mx-auto
            mb-3
            sm:mb-5
          "
        >
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-white">
              You are {{ minHops }} degrees away from Einstein!
            </h3>
            <div class="mt-2 sm:flex sm:items-start sm:justify-between">
              <div class="max-w-md text-sm leading-5 text-gray-300">
                <p>
                  But it's all relative... Either brag about it to the world via
                  <a
                    :href="twitterLink"
                    class="underline text-white"
                    target="_blank"
                    >Twitter</a
                  >
                  to help us out or you can just jump right into using the real
                  Literature Connector tool.
                </p>
              </div>
              <div
                class="
                  mt-5
                  sm:mt-0
                  sm:ml-6
                  sm:flex-shrink-0 sm:flex
                  sm:items-center
                "
              >
                <span class="inline-flex rounded-md shadow-sm">
                  <a
                    :href="toolUrl"
                    class="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      text-sm
                      leading-5
                      font-medium
                      rounded-md
                      text-white
                      bg-purple-500
                      hover:bg-purple-400
                      focus:outline-none
                      focus:border-purple-400
                      focus:ring-purple
                      transition
                      ease-in-out
                      duration-150
                    "
                  >
                    Use the Real Tool!
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <lit-connector-body
          :to="to"
          :from="from"
          @minHopsCalculated="setMinHops"
          :reccomendExtendedGraphs="false"
        />
      </div>
    </div>
    <FaqComp :faqs="faqs" />
    <BetaSignup />
    <LitReviewBuilder />
    <PaperInfoModal />
  </single-column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LitReviewBuilder from '../components/LitReviewBuilder.vue'
import PaperInfoModal from '../components/PaperInfoModal.vue'
import BetaSignup from '../components/BetaSignup.vue'
import api from '../utils/api'
import LitConnectorPaperSelector from '../components/LitConnectorPaperSelector.vue'
import LitConnectorBody from '../components/LitConnectorBody.vue'
import FaqComp from '../components/Faq.vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import { Paper } from '@/types/inciteful'

export default defineComponent({
  name: 'LitConnectorPage',
  components: {
    PaperInfoModal,
    LitReviewBuilder,
    BetaSignup,
    LitConnectorPaperSelector,
    LitConnectorBody,
    FaqComp,
    SingleColumn
  },
  data () {
    return {
      toParam: null as string | null,
      to: undefined as Paper | undefined,
      from: undefined as Paper | undefined,
      minHops: undefined as number | undefined,
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
          question: "Don't people actually do this with Kevin Bacon?",
          answer:
            'Yep, that\'s where I got the idea. <a target="_blank"class="underline hover:no-underline" href="https://oracleofbacon.org/">The Six Degrees of Kevin Bacon</a> is a game where you try to connect someone to Kevin Bacon in the smallest number of hops possible. Two people are linked if they are in a movie together. It originally started with <a target="_blank"class="underline hover:no-underline"href="https://en.wikipedia.org/wiki/Erd%C5%91s_number">Paul Erdős</a>.'
        },
        {
          question: "Why didn't you use Paul Erdős then?",
          answer:
            'Well the Erdős Number actually uses co-authorship as the method of establishing a link. Right now I don\'t have an author-centric database to run the analysis and the structured data surrounding the Authors isn\'t great. Get your <a target="_blank" class="underline hover:no-underline" href="https://orcid.org/">ORCID iD</a>! Well, that and Einstein is more famous...'
        }
      ]
    }
  },
  created () {
    this.toParam = this.$route.query.to as string | null
    api.getPaper('81268560').then(paper => (this.from = paper))
  },
  computed: {
    twitterLink (): string {
      const text = `My paper is only ${this.minHops} degrees away from Einstein: ${window.location}\n\nFind out how your paper is connected using @inciteful_xyz: https://inciteful.xyz/einstein\n\n#sixdegreesofeinstein`

      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    },
    toolUrl (): string {
      return '/c' + (this.to ? '?from=' + this.to.id : '')
    }
  },
  methods: {
    setMinHops (hopNum: number): void {
      this.minHops = hopNum
    },
    handleToSelect (paper: Paper, newParam: boolean): void {
      if (paper) {
        this.to = paper
      }

      if (newParam) {
        this.$router.push({ query: { ...this.$route.query, to: paper.id } })
      }
    }
  }
})
</script>
