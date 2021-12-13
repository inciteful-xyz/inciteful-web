<template>
  <div class="text-gray-800 relative">
    <input
      class="w-full px-4 py-2 border border-gray-300 rounded-md leading-5
    bg-white transition duration-150 ease-in-out focus:outline-none focus:border-blue-300"
      ref="searchBox"
      type="text"
      placeholder="Paper title, DOI, PubMed URL, or arXiv URL"
      v-model="query"
    />
    <div
      v-if="results"
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
      test
      <ul class="list-none p-0 m-0">
        <li
          class="cursor-pointer p-2 border-t border-gray-200 hover:bg-gray-200"
          v-for="result in results"
          :key="result.id"
          @click="sendSelect([result.id])"
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
// import Authors from './Authors.vue'
import numeral from 'numeral'
import { Paper, PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'Autosuggest',
  components: {
    // VueAutosuggest,
    // Authors
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
      results: undefined as Paper[] | undefined,
      timeout: null as number | null,
      selected: null as PaperID | null,
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
          }
        })
      }, this.debounceMilliseconds)
    }
  },
  methods: {
    getValue () {
      if (this.getSelectedId()) return this.getSelectedId()
      else return this.query
    },
    getSelectedId () {
      // @ts-ignore
      if (this.$refs.autocomplete.currentItem) {
        // @ts-ignore
        return this.$refs.autocomplete.currentItem.item.id
      }
      if (this.selected) return this.selected
    },
    format (val: number) {
      return numeral(val).format('0,0.[000000]')
    },
    getPaperValue (paper: Paper): string {
      return `${paper.title} (${paper.id})`
    },
    sendSelect (ids: PaperID[]) {
      api.getPaperIds(ids).then(ids => {
        this.$emit('selected', ids)
      })
    }
  }
})
</script>

<style lang="scss">
// placeholder-gray-500  sm:text-sm  placeholder-gray-400;

#autosuggest__input.autosuggest__input-open {
  @apply rounded-b;
}

.autosuggest__results .autosuggest__results-item {
  @apply cursor-pointer p-2 border-t border-gray-200;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  @apply border-t-0;
}

.autosuggest__results .autosuggest__results-before {
  @apply bg-gray-300 ml-0 px-5 py-6 border-t border-gray-200;
}

.autosuggest__results .autosuggest__results-item:active,
.autosuggest__results .autosuggest__results-item:hover,
.autosuggest__results .autosuggest__results-item:focus,
.autosuggest__results
  .autosuggest__results-item.autosuggest__results-item--highlighted {
  @apply bg-gray-200;
}
</style>
