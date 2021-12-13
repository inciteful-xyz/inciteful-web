<template>
  <div class="text-gray-800 relative">
    <!-- <vue-autosuggest
      ref="autocomplete"
      v-model="query"
      :suggestions="suggestions"
      :inputProps="inputProps"
      :getSuggestionValue="getSuggestionValue"
      :sectionConfigs="sectionConfigs"
      @selected="selectHandler"
      @input="fetchResults"
    >
      <template v-slot="{ suggestion }">
        <div class="pb-1 text-sm">
          {{ suggestion.item.title }}
        </div>
        <div class="text-xs">
          <Authors :authors="suggestion.item.author" /> ({{
            suggestion.item.published_year
          }}) -
          {{ format(suggestion.item.num_cited_by) }}
          citations
        </div>
      </template>
    </vue-autosuggest> -->
    <div
      v-if="!selectIsValid"
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
        overflow-y-scroll
        max-h-96;
      "
    >
      <div class="rounded-md bg-white shadow-xs p-2">
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          Invalid search: Check your spelling, enter a DOI, or another paper
          identifier
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { defineComponent } from 'vue'
// @ts-ignore
// import { VueAutosuggest } from 'vue-autosuggest'
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
      results: [],
      timeout: null as number | null,
      selected: null as PaperID | null,
      debounceMilliseconds: 200,
      sectionConfigs: {
        default: {
          limit: 10,
          // @ts-ignore
          onSelected: this.selectHandler
        }
      },
      inputProps: {
        id: 'autosuggest__input',
        placeholder: 'Paper title, DOI, PubMed URL, or arXiv URL',
        class: 'form-control',
        name: 'hello'
      },
      suggestions: [] as { name: string; data: Paper[] }[],
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
    fetchResults (): void {
      const query = this.query
      this.selectIsValid = true

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        this.selected = null

        api.searchPapers(query).then(papers => {
          if (papers && papers) {
            this.suggestions = [
              {
                name: 'default',
                data: papers
              }
            ]
          }
        })
      }, this.debounceMilliseconds)
    },
    getSuggestionValue (suggestion: { item: Paper }): string {
      return this.getPaperValue(suggestion.item)
    },
    getPaperValue (paper: Paper): string {
      return `${paper.title} (${paper.id})`
    },
    selectHandler (suggestion: { item: { id: string } }): void {
      if (suggestion) {
        this.selected = suggestion.item.id
        this.sendSelect([suggestion.item.id])
      }
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
#autosuggest__input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md leading-5 bg-white transition duration-150 ease-in-out;
}

#autosuggest {
  @apply w-full;
}

#autosuggest__input:focus {
  @apply outline-none border-blue-300;
}
// placeholder-gray-500  sm:text-sm  placeholder-gray-400;

#autosuggest__input.autosuggest__input-open {
  @apply rounded-b;
}

.autosuggest__results-container {
  @apply relative w-full;
}

.autosuggest__results {
  @apply absolute z-50 w-full;
  @apply rounded-b border rounded-tr-none rounded-tl-none border-gray-300 rounded-md bg-white p-0 overflow-y-scroll max-h-96;
}

.autosuggest__results ul {
  @apply list-none pl-0 m-0;
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
