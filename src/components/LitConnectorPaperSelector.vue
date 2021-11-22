<template>
  <div
    class="text-left relative shadow border-b border-gray-300 sm:rounded-lg p-4"
  >
    <div>
      <loader v-if="!loaded" />
      <div v-else-if="(!valid && loaded) || editing">
        <label
          for="searchBox"
          class="block text-sm font-medium text-gray-700 mb-1"
          v-if="searchLabel"
          >{{ searchLabel }}</label
        >
        <graph-search
          ref="searchBox"
          :defaultQuery="defaultQuery"
          :showImport="showImport"
          @selected="paperIdsSelected"
          @searched="handleSearched"
        />
        <div v-if="currentQuery">
          <search-results
            :query="currentQuery"
            @selected="paperSelected"
            :abstractLength="100"
          >
            <template v-slot:action="{ paper }">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  @click="paperSelected(paper)"
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
                    bg-purple-600
                    hover:bg-purple-500
                    focus:outline-none
                    focus:border-purple-700
                    focus:ring-purple
                    active:bg-purple-700
                    transition
                    ease-in-out
                    duration-150
                  "
                >
                  Connect Paper >>
                </button>
              </span>
            </template>
          </search-results>
        </div>
      </div>
      <div v-else-if="paper">
        <div class="absolute right-2 top-2">
          <button @click="setEdit()" title="Edit">
            <svg
              class="w-5 h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </button>
        </div>
        <paper-summary :paper="paper" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'
import GraphSearch from './GraphSearch.vue'
import Loader from './Loader.vue'
import PaperSummary from './PaperSummary.vue'
import SearchResults from './SearchResults.vue'

export default {
  name: 'LitConnectorPaperSelector',
  components: {
    PaperSummary,
    SearchResults,
    GraphSearch,
    Loader
  },
  props: {
    paperParam: {
      type: String,
      default: ''
    },
    showImport: {
      type: Boolean,
      default: false
    },
    searchLabel: String
  },
  data () {
    return {
      editing: false,
      paperId: undefined,
      paper: undefined,
      valid: true,
      loaded: false,
      currentQuery: undefined,
      defaultQuery: undefined
    }
  },
  created () {
    this.currentQuery = this.paperParam
    this.defaultQuery = this.paperParam

    if (!this.paperParam) {
      this.loaded = true
      this.valid = false
    }
  },
  computed: {},
  watch: {
    currentQuery (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.loadPaper(newVal)
      }
    }
  },
  methods: {
    setEdit () {
      this.editing = true
      this.defaultQuery = undefined
      this.currentQuery = undefined
    },
    loadPaper (param) {
      if (param) {
        this.connectPaperId(param, false)
      } else {
        this.valid = false
        this.loaded = true
      }
    },
    paperIdsSelected (ids) {
      if (ids.length > 0) {
        this.connectPaperId(ids[0], true)
      }
    },
    paperSelected (paper) {
      this.connectPaper(paper, true)
    },
    connectPaper (paper, setParam) {
      this.paper = paper
      const param = setParam ? paper.id : undefined
      this.$emit('paperSelected', paper, param)
      this.valid = true
      this.loaded = true
      this.editing = false
    },
    connectPaperId (id, setParam) {
      api
        .getPaper(id)
        .then(data => {
          if (data) {
            this.connectPaper(data, setParam)
          } else {
            this.valid = false
          }
        })
        .catch(_ => {
          this.valid = false
        })
        .finally(() => {
          this.loaded = true
        })
    },
    handleSearched (query) {
      this.currentQuery = query
    }
  }
}
</script>
