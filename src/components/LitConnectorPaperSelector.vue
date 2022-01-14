<template>
  <div
    class="text-left relative shadow border-b border-gray-300 sm:rounded-lg p-4"
  >
    <div>
      <loader v-if="!loaded" />
      <div v-else-if="(!valid && loaded) || editing">
        <div v-if="paper" class="absolute right-2 top-2">
          <button @click="cancelEdit()" title="Cancel">
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

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

<script lang="ts">
import { Paper, PaperID } from '@/types/inciteful'
import { defineComponent } from 'vue'
import api from '../utils/api'
import GraphSearch from './GraphSearch.vue'
import Loader from './Loader.vue'
import PaperSummary from './PaperSummary.vue'
import SearchResults from './SearchResults.vue'

export default defineComponent({
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
      paperId: undefined as PaperID | undefined,
      paper: undefined as Paper | undefined,
      valid: true,
      loaded: false,
      currentQuery: undefined as string | undefined,
      defaultQuery: undefined as string | undefined
    }
  },
  created () {
    this.setupPaper(this.paperParam)
  },
  computed: {},
  emits: ['paperSelected'],
  watch: {
    currentQuery (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.loadPaper(newVal)
      }
    },
    paperParam (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setupPaper(newVal)
      }
    }
  },
  methods: {
    cancelEdit () {
      this.editing = false
    },
    setEdit () {
      this.editing = true
      this.defaultQuery = undefined
      this.currentQuery = undefined
    },
    loadPaper (param: PaperID) {
      if (param) {
        this.connectPaperId(param, false)
      } else {
        this.valid = false
        this.loaded = true
      }
    },
    paperIdsSelected (ids: PaperID[]) {
      if (ids.length > 0) {
        this.connectPaperId(ids[0], true)
      }
    },
    paperSelected (paper: Paper) {
      this.connectPaper(paper, true)
    },
    setupPaper (param: PaperID) {
      if (param) {
        this.currentQuery = param
        this.defaultQuery = param

        if (!param) {
          this.loaded = true
          this.valid = false
        }
      }
    },
    connectPaper (paper: Paper, setParam: boolean) {
      this.paper = paper
      const param = setParam ? paper.id : undefined
      this.$emit('paperSelected', paper, param)
      this.valid = true
      this.loaded = true
      this.editing = false
    },
    connectPaperId (id: PaperID, setParam: boolean) {
      api
        .getPaper(id)
        .then(data => {
          if (data) {
            this.connectPaper(data, setParam)
          } else {
            this.valid = false
          }
        })
        .catch(() => {
          this.valid = false
        })
        .finally(() => {
          this.loaded = true
        })
    },
    handleSearched (query: string) {
      this.currentQuery = query
    }
  }
})
</script>
