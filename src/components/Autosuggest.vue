<template>
  <div class="text-theme-charcoal relative" @keydown.esc="hideResults()" @keydown.enter="sendSelect(null)"
    @focusout="onFocusOut">
    <input @click="displayResults()" @keydown.up.prevent="registerKeypress('up')" @keydown.down.prevent="registerKeypress('down')"
      @keydown.enter="sendSearched()" @focus="isFocused = true" class="w-full px-2 py-2 text-sm outline-none border-none focus:ring-0 bg-transparent"
      ref="searchBox" type="text" placeholder="Paper title, DOI, PubMed URL, or arXiv URL" :value="query"
      @input="e => (query = e.target ? (e.target as HTMLInputElement).value : '')"
      role="combobox"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-expanded="shouldShowResults"
      aria-controls="search-results-listbox"
      :aria-activedescendant="highlighted !== null ? `search-result-${highlighted}` : undefined"
      aria-label="Search for papers" />
    <div v-if="shouldShowResults" class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <ul id="search-results-listbox" role="listbox" class="list-none p-0 m-0" @keydown.left="registerKeypress('up')" @keydown.up="registerKeypress('up')"
        @keydown.right="registerKeypress('down')" @keydown.down="registerKeypress('down')" aria-label="Search results">
        <li class="cursor-pointer p-3 border-b border-gray-100 last:border-b-0 hover:bg-theme-pink transition-colors" v-for="(result, index) in results"
          :key="index" @click="sendSelect(index)" v-touch:tap="sendSelect(index)"
          :class="{ 'bg-theme-pink': highlighted === index }"
          :id="`search-result-${index}`"
          role="option"
          :aria-selected="highlighted === index">
          <div class="text-sm font-medium text-theme-charcoal" v-html="result.title"></div>
          <div class="text-xs text-gray-500 mt-1">
            <Authors :authors="result.author" /> ({{ result.published_year }}) -
            {{ format(result.num_cited_by) }} citations
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import api from '../utils/incitefulApi'
import numeral from 'numeral'
import { Paper, PaperID } from '@/types/incitefulTypes'
import Authors from './Authors.vue'
import { searchOpenAlex } from '../utils/openalexApi'

export default defineComponent({
  name: 'Autosuggest',
  components: {
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
  emits: ['selected', 'searched', 'selectedPaper'],
  data() {
    return {
      query: '',
      showResults: true,
      results: undefined as Paper[] | undefined,
      timeout: null as number | null,
      selected: null as PaperID | null,
      highlighted: null as number | null,
      debounceMilliseconds: 200,
      selectIsValid: true,
      isFocused: false
    }
  },
  created(): void {
    this.query = this.defaultQuery
    if (this.defaultPaperId) {
      api.getPaper(this.defaultPaperId).then(data => {
        if (data !== undefined) {
          this.query = this.getPaperValue(data)
        }
      })
    }
  },
  computed: {
    shouldShowResults(): boolean {
      return (
        this.showResults &&
        this.isFocused &&
        this.results !== undefined &&
        this.results.length > 0
      )
    }
  },
  watch: {
    query(newVal) {
      const query = newVal
      this.selectIsValid = true
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = window.setTimeout(() => {
        this.selected = null
        searchOpenAlex(query).then(papers => {
          if (papers && papers.length > 0) {
            this.results = papers.slice(0, 10)
            this.displayResults()
          }
        })
      }, this.debounceMilliseconds)
    }
  },
  methods: {
    registerKeypress(direction: 'up' | 'down') {
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
    hideResults() {
      this.showResults = false
      this.highlighted = null
    },
    onFocusOut(e: FocusEvent) {
      const container = e.currentTarget as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement | null
      if (!relatedTarget || !container.contains(relatedTarget)) {
        setTimeout(() => {
          this.isFocused = false
          this.hideResults()
        }, 150)
      }
    },
    displayResults() {
      this.showResults = true
    },
    getValue() {
      if (this.getSelectedId()) return this.getSelectedId()
      else return this.query
    },
    getSelectedId(): string | undefined {
      if (
        this.results &&
        this.highlighted !== null &&
        this.results[this.highlighted] !== undefined
      ) {
        return this.results[this.highlighted].id
      }
    },
    format(val: number) {
      return numeral(val).format('0,0.[000000]')
    },
    getPaperValue(paper: Paper): string {
      return `${paper.title} (${paper.id})`
    },
    sendSelect(index: number | null) {
      return () => {
        if (this.results && index !== null) {
          const paper = this.results[index]
          if (paper) {
            this.showResults = false
            // @ts-ignore
            this.$refs.searchBox.blur()
            this.$emit('selected', [paper.id])
            this.query = `${paper.title} (${paper.id})`
          }
        }
      }
    },
    sendSearched() {
      if (this.highlighted !== null && this.highlighted >= 0) {
        this.sendSelect(this.highlighted)()
      } else if (this.query) {
        this.$emit('searched', this.query)
        this.showResults = false
        // @ts-ignore
        this.$refs.searchBox.blur()
      }
    }
  }
})
</script>

<style scoped>
input::placeholder {
  color: #9F89CE;
}
</style>
