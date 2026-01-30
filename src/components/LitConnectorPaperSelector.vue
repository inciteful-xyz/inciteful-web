<template>
  <div class="text-left relative">
    <loader v-if="!loaded" />
    <div v-else-if="(!valid && loaded) || editing">
      <div v-if="paper" class="absolute right-3 top-3 z-10">
        <button @click="cancelEdit()" title="Cancel" aria-label="Cancel editing" class="text-theme-violet hover:text-theme-violet-2 transition-colors">
          <XCircleIcon class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

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
            <button
              @click="paperSelected(paper)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-theme-violet hover:bg-theme-violet-2 transition-colors"
            >
              Connect Paper
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </template>
        </search-results>
      </div>
    </div>
    <div v-else-if="paper" class="p-3 bg-white rounded-xl border-2 border-theme-violet shadow-md">
      <div class="absolute right-3 top-3">
        <button @click="setEdit()" title="Edit" aria-label="Edit paper selection" class="text-theme-violet hover:text-theme-violet-2 transition-colors">
          <PencilSquareIcon class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <paper-summary :paper="paper" />
    </div>
  </div>
</template>

<script lang="ts">
import { Paper, PaperID } from '@/types/incitefulTypes'
import { defineComponent } from 'vue'
import api from '../utils/incitefulApi'
import GraphSearch from './GraphSearch.vue'
import Loader from './Loader.vue'
import PaperSummary from './PaperSummary.vue'
import SearchResults from './SearchResults.vue'
import { XCircleIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'LitConnectorPaperSelector',
  components: {
    PaperSummary,
    SearchResults,
    GraphSearch,
    Loader,
    XCircleIcon,
    PencilSquareIcon
  },
  props: {
    paperParam: {
      type: String,
      default: ''
    },
    showImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
  created() {
    this.setupPaper(this.paperParam)
  },
  computed: {},
  emits: ['paperSelected'],
  watch: {
    currentQuery(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.loadPaper(newVal)
      }
    },
    paperParam(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setupPaper(newVal)
      }
    }
  },
  methods: {
    cancelEdit() {
      this.editing = false
    },
    setEdit() {
      this.editing = true
      this.defaultQuery = undefined
      this.currentQuery = undefined
    },
    loadPaper(param: PaperID) {
      if (param) {
        this.connectPaperId(param, false)
      } else {
        this.valid = false
        this.loaded = true
      }
    },
    paperIdsSelected(ids: PaperID[]) {
      if (ids.length > 0) {
        this.connectPaperId(ids[0], true)
      }
    },
    paperSelected(paper: Paper) {
      this.connectPaper(paper, true)
    },
    setupPaper(param: PaperID) {
      if (param) {
        this.currentQuery = param
        this.defaultQuery = param
      } else {
        this.loaded = true
        this.valid = false
      }
    },
    connectPaper(paper: Paper, setParam: boolean) {
      this.paper = paper
      const param = setParam ? paper.id : undefined
      this.$emit('paperSelected', paper, param)
      this.valid = true
      this.loaded = true
      this.editing = false
    },
    connectPaperId(id: PaperID, setParam: boolean) {
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
    handleSearched(query: string) {
      this.currentQuery = query
    }
  }
})
</script>
