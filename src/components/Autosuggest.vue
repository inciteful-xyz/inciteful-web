<template>
  <div
    class="text-gray-800 relative"
    @keydown.esc="hideResults()"
    @keydown.enter="sendSelect(results[highlighted])"
    v-click-outside="hideResults"
  >
    <input
      @click="displayResults()"
      @keydown.up="registerKeypress('up')"
      @keydown.down="registerKeypress('down')"
      class="w-full px-4 py-2 border border-gray-300 rounded-md leading-5
    bg-white transition duration-150 ease-in-out focus:outline-none focus:border-blue-300"
      ref="searchBox"
      type="text"
      placeholder="Paper title, DOI, PubMed URL, or arXiv URL"
      v-model="query"
    />
    <div
      v-if="results && showResults"
      class="
        origin-top-right
        absolute
        z-50
        w-full
        rounded-b
        border
        rounded-tr-none rounded-tl-none
        border-gray-300
        rounded-md
        bg-white
        p-0
        m-0
        overflow-y-scroll
        max-h-96;
      "
    >
      <ul
        class="list-none p-0 m-0"
        @keydown.left="registerKeypress('up')"
        @keydown.up="registerKeypress('up')"
        @keydown.right="registerKeypress('down')"
        @keydown.down="registerKeypress('down')"
      >
        <li
          class="cursor-pointer p-2 border-t border-gray-200 hover:bg-gray-200"
          v-for="(result, index) in results"
          :key="index"
          @click="sendSelect(result)"
          :class="{ 'bg-gray-200': highlighted === index }"
        >
          <div class="pb-1 text-sm">{{ result.title }} title</div>
          <div class="text-xs">
            <Authors :authors="result.author" /> ({{ result.published_year }}) -
            {{ format(result.num_cited_by) }}
            citations
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { defineComponent } from 'vue'
import api from '../utils/api'
import Authors from './Authors.vue'
import numeral from 'numeral'
import { Paper, PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'Autosuggest',
  components: {
    // VueAutosuggest,
    Authors
  },
  props: {
    clearOnSelect: {
      type: Boolean,
      default: false
    },
    defaultQuery: {
      type: String,
      default: null
    },
    defaultPaperId: {
      type: String,
      default: undefined
    }
  },
  emits: ['selected'],
  data () {
    return {
      query: '',
      showResults: true,
      results: undefined as Paper[] | undefined,
      timeout: null as number | null,
      selected: null as PaperID | null,
      highlighted: null as number | null,
      debounceMilliseconds: 200,
      selectIsValid: true
    }
  },
  created (): void {
    this.query = this.defaultQuery

    if (this.defaultPaperId) {
      api.getPaper(this.defaultPaperId).then(data => {
        if (data !== undefined) {
          this.query = this.getPaperValue(data)
        }
      })
    }
  },
  watch: {
    query (newVal) {
      const query = newVal
      this.selectIsValid = true

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        this.selected = null

        api.searchPapers(query).then(papers => {
          if (papers && papers.length > 0) {
            this.results = papers
            this.displayResults()
          }
        })
      }, this.debounceMilliseconds)
    }
  },
  methods: {
    registerKeypress (direction: 'up' | 'down') {
      if (this.results) {
        if (this.highlighted === null) {
          this.highlighted = 0
        } else if (direction === 'down') {
          this.highlighted = this.highlighted + 1
        } else {
          this.highlighted = this.highlighted - 1
        }

        if (this.highlighted < 0) {
          this.highlighted = this.results.length
        } else {
          this.highlighted = this.highlighted % this.results.length
        }
      }
    },
    hideResults () {
      this.showResults = false
      this.highlighted = null
    },
    displayResults () {
      this.showResults = true
    },

    getValue () {
      if (this.getSelectedId()) return this.getSelectedId()
      else return this.query
    },
    getSelectedId (): string | undefined {
      if (
        this.results &&
        this.highlighted !== null &&
        this.results[this.highlighted] !== undefined
      ) {
        return this.results[this.highlighted].id
      }
    },
    format (val: number) {
      return numeral(val).format('0,0.[000000]')
    },
    getPaperValue (paper: Paper): string {
      return `${paper.title} (${paper.id})`
    },
    sendSelect (paper: Paper | undefined) {
      if (paper) {
        api.getPaperIds([paper.id]).then(ids => {
          this.showResults = false
          this.$emit('selected', ids)
        })

        // this.query = `${paper.title} (${paper.id})`
        // this.results = undefined
      }
    }
  }
})
</script>
