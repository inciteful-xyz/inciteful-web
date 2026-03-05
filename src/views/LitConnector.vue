<template>
  <div class="animate-fade-up">
    <ModalManager />
    <!-- Hero Section (shown when no papers selected) -->
    <Section v-if="!isValid" class="pt-6 pb-4 md:pt-8 md:pb-6 bg-theme-light">
      <Container md>
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="text-center lg:text-left mb-8 lg:mb-0">
            <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
              <span class="text-theme-violet font-normal">Literature Connector</span>
            </h1>
            <TextLG class="text-theme-charcoal mb-6">
              Interested in interdisciplinary studies? Discover how two bodies of
              literature connect to one another through citations.
            </TextLG>
            <p class="text-theme-charcoal">
              Enter two papers and we'll show you the shortest paths between them,
              let you interact with the graph, and search through the connecting papers.
              Then send those papers to our Discovery tool to find more relevant literature.
            </p>
          </div>
          <div class="relative">
            <img
              class="rounded-2xl shadow-lg border border-theme-pink"
              src="../assets/images/connector-graph.png"
              alt="Literature Connector graph visualization"
            />
          </div>
        </div>
      </Container>
    </Section>

    <!-- Paper Selection Section -->
    <Section :class="isValid ? 'pt-6 md:pt-8' : ''" class="bg-white">
      <Container md>
        <!-- Paper Selectors -->
        <div class="p-6 sm:p-8 border border-theme-pink rounded-2xl bg-theme-lavender mb-8" id="connected-papers">
          <div class="sm:flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-theme-charcoal mb-2 font-dm-mono uppercase">From</label>
              <lit-connector-paper-selector
                ref="fromSelector"
                :paperParam="fromParam"
                @paperSelected="handleFromSelect"
              />
            </div>
            <div class="flex-none text-center py-4 sm:py-0">
              <div class="w-12 h-12 rounded-full bg-theme-violet flex items-center justify-center mx-auto">
                <ArrowRightIcon class="w-6 h-6 text-white hidden sm:block" />
                <ArrowDownIcon class="w-6 h-6 text-white sm:hidden" />
              </div>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-theme-charcoal mb-2 font-dm-mono uppercase">To</label>
              <lit-connector-paper-selector
                ref="toSelector"
                :paperParam="toParam"
                @paperSelected="handleToSelect"
              />
            </div>
          </div>
        </div>

        <!-- Connector Body (Graph) -->
        <lit-connector-body :to="to" :from="from" />

        <!-- FAQ Section -->
        <div v-if="!isValid" class="mt-12">
          <h2 class="font-battambang font-light text-2xl text-black mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div class="space-y-4">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="p-6 border border-theme-pink rounded-2xl bg-white"
            >
              <h3 class="font-semibold text-theme-charcoal mb-2">{{ faq.question }}</h3>
              <p class="text-theme-charcoal leading-relaxed" v-html="faq.answer"></p>
            </div>
          </div>
        </div>

        <lit-connector-tour :ready="pageReady" />
      </Container>
    </Section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LitConnectorPaperSelector from '../components/LitConnectorPaperSelector.vue'
import LitConnectorBody from '../components/LitConnectorBody.vue'
import LitConnectorTour from '../components/LitConnectorTour.vue'
import ModalManager from '../components/modals/ModalManager.vue'
import { Section, Container } from '@/components/ui/layouts'
import { TextLG } from '@/components/ui/typography'
import { Paper } from '@/types/incitefulTypes'
import { ArrowRightIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import { EmitEvents } from '@/utils/emitHelpers'
export default defineComponent({
  name: 'LitConnectorPage',
  components: {
    LitConnectorPaperSelector,
    LitConnectorBody,
    LitConnectorTour,
    ModalManager,
    Section,
    Container,
    TextLG,
    ArrowRightIcon,
    ArrowDownIcon
  },
  data() {
    return {
      pageReady: false,
      toParam: null as string | null,
      to: undefined as Paper | undefined,
      fromParam: null as string | null,
      from: undefined as Paper | undefined,
      graphLoadedHandler: undefined as (() => void) | undefined,
      faqs: [
        {
          question: 'How are the links made between papers?',
          answer:
            'A link is established through citations. Two papers are linked if either one cites the other. Starting from the seed paper, we recursively search through all the papers that are cited by the seed paper or that cite the seed paper.'
        },
        {
          question: 'How many hops will it search?',
          answer:
            "The largest number of hops right now is six, but we've honestly not found two papers that are more than five away. Obviously at that point the relevance of the search is called into question. But it's still fun to play around with!"
        },
        {
          question: "Can I use multiple papers in my 'from' or 'to'?",
          answer:
            "Not right now. We're still working through what it means to show the 'paths' between two groups of papers. Stay tuned though."
        },
        {
          question: 'Can I connect the papers by anything but the shortest path?',
          answer:
            "Not yet. We're exploring the idea of showing the shortest paths as well as other 'important' paths. But defining 'important' is hard and the number of paths grows exponentially once you go one level beyond the shortest path."
        }
      ]
    }
  },
  mounted() {
    this.graphLoadedHandler = () => {
      this.pageReady = true
    }
    this.emitter.on(EmitEvents.GraphLoaded, this.graphLoadedHandler)
  },
  beforeUnmount() {
    this.emitter.off(EmitEvents.GraphLoaded, this.graphLoadedHandler)
  },
  created() {
    if (this.$route.query.to) {
      this.toParam = this.$route.query.to.toString()
    }
    if (this.$route.query.from) {
      this.fromParam = this.$route.query.from.toString()
    }
  },
  computed: {
    isValid(): boolean {
      return this.to !== undefined && this.from !== undefined
    }
  },
  watch: {
    '$route.query.to'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.toParam = newVal ? newVal.toString() : null
      }
    },
    '$route.query.from'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fromParam = newVal ? newVal.toString() : null
      }
    }
  },
  methods: {
    handleFromSelect(paper: Paper | undefined) {
      if (paper !== undefined) {
        this.from = paper
        if (paper && this.fromParam !== paper.id) {
          this.$router.push({ query: { ...this.$route.query, from: paper.id } })
        }
      }
    },
    handleToSelect(paper: Paper | undefined) {
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
