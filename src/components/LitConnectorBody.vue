<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <div v-else-if="validState">
      <Loader v-if="!loaded" />
      <div v-else-if="loaded">
        <div v-if="!foundPath">No paths found</div>
        <div v-else>
          <div class="mb-6">
            <dl
              class="text-center sm:mx-auto gap-2 sm:gap-4 sm:text-lg text-sm"
            >
              <div class="flex flex-wrap" id="connection-stats">
                <stat>
                  <template v-slot:name>Min Hops</template>
                  <template v-slot:value> {{ minHops }}</template>
                </stat>
                <stat>
                  <template v-slot:name>Max Hops</template>
                  <template v-slot:value> {{ maxHops }}</template>
                </stat>
                <stat>
                  <template v-slot:name>Papers Searched</template>
                  <template v-slot:value>
                    {{ results.papers_searched }}</template
                  >
                </stat>
                <stat>
                  <template v-slot:name>Paths Found</template>
                  <template v-slot:value> {{ results.num_paths }}</template>
                </stat>
                <stat>
                  <template v-slot:name>Papers in Paths</template>
                  <template v-slot:value>
                    {{ connectingPapers.length }}</template
                  >
                </stat>
              </div>
            </dl>
          </div>
          <div
            v-if="showExtendedGraphsReccomendation"
            class="rounded-md bg-blue-50 p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <!-- Heroicon name: information-circle -->
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
                  When the results are a "small" graph such as this, we
                  reccomend using the "Extended Graphs" feature to allow for
                  longer paths and more context.
                </p>
                <p class="mt-3 text-sm leading-5 md:mt-0 md:ml-6">
                  <button
                    @click="toggleExtendedGraphs"
                    class="
                      whitespace-nowrap
                      font-medium
                      text-blue-700
                      hover:text-blue-600
                      underline
                      transition
                      ease-in-out
                      duration-150
                    "
                  >
                    Activate &rarr;
                  </button>
                </p>
              </div>
            </div>
          </div>
          <div id="graph-view">
            <GraphView
              :graphData="graphData"
              :loaded="loaded"
              :filteredIds="filteredIds"
              :highlightedIds="highlightedIds"
            >
              <div class="mt-6">
                <div
                  id="graph-filters"
                  class="
                    lg:flex-1
                    border-b
                    pb-5
                    mb-5
                    lg:border-b-0
                    lg:mb-0
                    lg:pb-0
                  "
                >
                  <h3 class="text-gray-700 text-base font-semibold">
                    Paper Filters
                  </h3>
                  <div class="w-full pt-2 lg:flex flex-wrap">
                    <div class="flex-grow pb-3 pr-3">
                      <label
                        for="keywordFilter"
                        class="
                          block
                          text-sm
                          leading-5
                          font-medium
                          text-gray-800
                        "
                        >Keywords & Authors</label
                      >
                      <div class="mt-1">
                        <input
                          type="text"
                          v-model="textKeywords"
                          ref="keywordFilter"
                          class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block sm:text-sm border-gray-300 rounded-md w-full"
                          placeholder="albert einstein relativity"
                        />
                      </div>
                    </div>
                    <div class="flex-wrap flex lg:whitespace-nowrap pb-3">
                      <div class="flex-none">
                        <div class="inline-block">
                          <label
                            for="minYear"
                            class="
                              block
                              text-sm
                              font-medium
                              leading-5
                              text-gray-800
                            "
                            >Min Year</label
                          >
                          <div class="mt-1">
                            <input
                              ref="minYearFilter"
                              type="text"
                              class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block sm:text-sm border-gray-300 rounded-md w-20"
                              v-model="minYear"
                              maxlength="4"
                              placeholder="2005"
                            />
                          </div>
                        </div>
                        <div class="inline-block pl-3">
                          <label
                            for="maxYear"
                            class="
                              block
                              text-sm
                              font-medium
                              leading-5
                              text-gray-800
                            "
                            >Max Year</label
                          >
                          <div class="mt-1">
                            <input
                              ref="maxYearFilter"
                              type="text"
                              class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block sm:text-sm border-gray-300 rounded-md w-20"
                              maxlength="4"
                              v-model="maxYear"
                              placeholder="2015"
                            />
                          </div>
                        </div>
                        <div class="inline-block pl-3">
                          <label
                            for="extendedGraphs"
                            class="
                              block
                              text-sm
                              font-medium
                              leading-5
                              text-gray-800
                            "
                            >Ext. Graph</label
                          >
                          <div class="mt-1">
                            <span
                              @click="toggleExtendedGraphs"
                              role="checkbox"
                              tabindex="0"
                              aria-checked="false"
                              title="Extend the graph an extra layer for small/uninteresting graphs."
                              class="
                                relative
                                inline-flex
                                flex-shrink-0
                                h-6
                                w-11
                                border-2 border-transparent
                                rounded-full
                                cursor-pointer
                                transition-colors
                                ease-in-out
                                duration-200
                                focus:outline-none
                                focus:ring
                              "
                              :class="{
                                'bg-purple-600': extendedGraph,
                                'bg-gray-200': !extendedGraph
                              }"
                            >
                              <span
                                aria-hidden="true"
                                class="
                                  inline-block
                                  h-5
                                  w-5
                                  rounded-full
                                  bg-white
                                  shadow
                                  transform
                                  transition
                                  ease-in-out
                                  duration-200
                                "
                                :class="{
                                  'translate-x-5': extendedGraph,
                                  'translate-x-0': !extendedGraph
                                }"
                              ></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="paper-keywords"
                    v-if="titleKeywords && titleKeywords.length > 0"
                    class="pb-3"
                  >
                    <button
                      class="
                        inline-flex
                        items-center
                        px-2.5
                        mx-1
                        py-0.5
                        rounded-full
                        text-xs
                        font-medium
                        leading-4
                        bg-purple-100
                        text-purple-800
                      "
                      v-for="(keyword, index) in titleKeywords"
                      :key="index"
                      @click="keywordClick(keyword.term)"
                      @mouseover="hoverKeywords = keyword.term"
                      @mouseleave="hoverKeywords = undefined"
                    >
                      {{ keyword.term }} ({{ keyword.count }})
                    </button>
                  </div>
                </div>
                <div id="connector-table">
                  <ConnectorTable
                    :papers="sortedPapers"
                    @lockPaper="registerLockPaper"
                    @mouseoverRow="registerMouseoverRow"
                    @mouseleaveRow="registerMouseleaveRow"
                  />
                </div>
              </div>
            </GraphView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import GraphView from './GraphView'
import Loader from './Loader'
import api from '../utils/api'
import Stat from './Stat.vue'
import ConnectorTable from './ConnectorTable'
import keywordFuncs from '../utils/keywords'
import { stemmer } from 'stemmer'
import bus from '../utils/bus'

import FlexSearch from 'flexsearch'

export default Vue.extend({
  name: 'LitConnectorBody',
  components: {
    Loader,
    GraphView,
    ConnectorTable,
    Stat
  },
  props: {
    to: Object,
    from: Object,
    reccomendExtendedGraphs: { type: Boolean, default: true }
  },
  data () {
    return {
      error: undefined,
      results: undefined,
      lockedPaperIds: [],
      textKeywords: undefined,
      hoverKeywords: undefined,
      minYear: undefined,
      maxYear: undefined,
      highlightedIds: []
    }
  },
  mounted () {
    bus.$on('set_as_to', id => {
      if (this.to.id !== id && this.from.id) {
        this.$router.push({
          query: { to: id }
        })
      }
    })
    bus.$on('set_as_from', id => {
      if (this.from.id !== id && this.to.id) {
        this.$router.push({ query: { from: id } })
      }
    })
    bus.$on('lock_paper', id => {
      if (id) {
        this.registerLockPaper(id)
      }
    })
  },
  computed: {
    extendedGraph () {
      return this.$route.query.extendedGraph === 'true'
    },
    effectiveKeyword () {
      return this.hoverKeywords ? this.hoverKeywords : this.textKeywords
    },
    graphData () {
      return {
        type: 'connector',
        papers: this.lockedPapers,
        connections: this.lockedConnections,
        paths: this.lockedPaths,
        toId: this.to.id,
        fromId: this.from.id,
        modalOptions: { connectTo: this.sourcePaperId }
      }
    },
    loaded () {
      return this.to && this.from && this.results
    },
    validState () {
      return this.from && this.to
    },
    foundPath () {
      return (
        this.results && this.results.num_paths && this.results.num_paths > 0
      )
    },
    minHops () {
      if (this.loaded) {
        const hops = Math.min(...this.results.paths.map(p => p.length)) - 1
        this.$emit('minHopsCalculated', hops)
        return hops
      }

      return undefined
    },
    maxHops () {
      if (this.loaded) {
        const hops = Math.max(...this.results.paths.map(p => p.length)) - 1
        return hops
      }

      return undefined
    },
    lockedPapers () {
      if (this.lockedPaperIds.length === 0) return this.results.papers

      const paperIds = new Set()

      this.lockedPaths.forEach(p => p.forEach(id => paperIds.add(id)))

      const lockedPapers = this.results.papers.filter(p => paperIds.has(p.id))

      lockedPapers.forEach(
        p => (p.isLocked = this.lockedPaperIds.includes(p.id))
      )

      return lockedPapers
    },
    lockedPaths () {
      if (this.lockedPaperIds.length === 0) return this.results.paths

      return this.results.paths.filter(p =>
        this.lockedPaperIds.every(el => p.includes(el))
      )
    },
    lockedConnections () {
      if (this.lockedPaperIds.length === 0) return this.results.connections

      const connections = new Set()

      this.lockedPaths.forEach(p => {
        for (let i = 1; i < p.length; i++) {
          connections.add(JSON.stringify({ citing: p[i - 1], cited: p[i] }))
        }
      })

      return [...connections].map(c => JSON.parse(c))
    },
    connectingPapers () {
      if (this.loaded) {
        return this.lockedPapers.filter(
          p => p.id !== this.to.id && p.id !== this.from.id
        )
      }

      return undefined
    },
    searchIndex () {
      const index = new FlexSearch.Index({
        encode: sentence => {
          const wordsArr = sentence.split(' ').map(word => {
            const cleanWord = word.replace(/[^a-zA-Z ]/g, '')
            const stemmed = stemmer(cleanWord)
            return stemmed
          })

          return wordsArr
        },
        tokenize: 'reverse'
      })

      this.connectingPapers.forEach(paper => {
        const authors = paper.author
          .map(author => {
            return author.name
          })
          .join(' ')

        index.add(paper.id, paper.title + ' ' + authors)
      })

      window.si = index
      return index
    },
    filteredPapers () {
      const minYear = Number(this.minYear)
      const maxYear = Number(this.maxYear)

      let papers

      if (this.effectiveKeyword) {
        const resultIds = new Set()

        this.searchIndex
          .search(this.effectiveKeyword)
          .forEach(id => resultIds.add(id))

        papers = this.connectingPapers.filter(paper => resultIds.has(paper.id))
      } else {
        papers = [...this.connectingPapers]
      }

      if (minYear) {
        papers = papers.filter(paper => paper.published_year >= minYear)
      }
      if (maxYear) {
        papers = papers.filter(paper => paper.published_year <= maxYear)
      }

      return papers
    },
    filteredIds () {
      const ids = new Set()

      this.filteredPapers.forEach(paper => ids.add(paper.id))
      ids.add(this.to.id)
      ids.add(this.from.id)

      return ids
    },
    sortedPapers () {
      if (this.filteredPapers) {
        const sortPapers = [...this.filteredPapers]
        sortPapers.sort((a, b) => b.num_cited_by - a.num_cited_by)
        sortPapers.sort((a, b) => a.distance - b.distance)
        sortPapers.sort((a, b) => b.path_count - a.path_count)
        return sortPapers
      }
      return undefined
    },
    titleKeywords () {
      return keywordFuncs.extract(this.connectingPapers)
    },
    showExtendedGraphsReccomendation () {
      return (
        this.reccomendExtendedGraphs &&
        this.results &&
        this.results.paths &&
        this.results.paths.length < 5
      )
    }
  },
  watch: {
    validState (newVal) {
      if (newVal) {
        this.loadGraph()
      }
    },
    to () {
      this.resetFilters()
    },
    from () {
      this.resetFilters()
    },
    extendedGraph (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.resetFilters()
        this.loadGraph()
      }
    }
  },
  methods: {
    loadGraph () {
      if (this.validState) {
        api
          .connectPapers(this.from.id, this.to.id, this.extendedGraph)
          .then(data => {
            this.results = data
            bus.$emit('graph_loaded')
          })
      }
    },
    registerMouseoverRow (id) {
      if (!this.highlightedIds.find(id1 => id1 === id)) {
        this.highlightedIds.push(id)
      }
    },
    registerMouseleaveRow (id) {
      if (this.highlightedIds.find(id1 => id1 === id)) {
        this.highlightedIds = this.highlightedIds.filter(id1 => id !== id1)
      }
    },
    registerLockPaper (id) {
      if (this.lockedPaperIds.find(id1 => id1 === id)) {
        this.lockedPapers.forEach(p => {
          if (p.id === id) p.isLocked = false
        })

        this.lockedPaperIds = this.lockedPaperIds.filter(id1 => id !== id1)
      } else {
        this.lockedPaperIds.push(id)
      }
    },
    keywordClick (keyword) {
      this.textKeywords = keyword === this.textKeywords ? '' : keyword
    },
    resetFilters () {
      this.textKeywords = ''
      this.minYear = ''
      this.maxYear = ''
      this.lockedPaperIds = []
    },
    toggleExtendedGraphs () {
      this.$router.push({
        query: {
          ...this.$route.query,
          extendedGraph: this.extendedGraph ? undefined : true
        }
      })
    }
  }
})
</script>
