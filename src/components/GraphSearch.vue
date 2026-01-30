<template>
  <div class="w-full">
    <div class="flex gap-1 p-1 bg-white border-2 border-theme-violet rounded-xl shadow-md">
      <!-- Search Icon -->
      <div class="flex items-center pl-2">
        <MagnifyingGlassIcon class="w-5 h-5 text-theme-violet" aria-hidden="true" />
      </div>

      <!-- Autosuggest Input -->
      <div class="flex-1 min-w-0">
        <Autosuggest ref="autosuggest" :defaultQuery="defaultQuery" @selected="sendSelect" @searched="sendSearched" />
      </div>

      <!-- Search Button -->
      <button type="button" class="p-2 bg-theme-violet text-white rounded-lg hover:bg-theme-violet-2 transition-colors flex items-center justify-center" v-on:click="searchClick" aria-label="Search">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
    <div v-if="showImport" class="text-center pt-3 text-sm text-theme-charcoal">
      <input type="file" style="display: none" ref="bibUploadInput" accept=".bib" @change="parseBib" />
      or
      <button class="text-theme-violet hover:underline font-medium" @click="uploadBib">
        Import BibTeX file
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import api from '@/utils/incitefulApi'
import bib from '@/utils/bib'
import Autosuggest from './Autosuggest.vue'
import { PaperID } from '@/types/incitefulTypes'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'GraphSearch',
  components: {
    Autosuggest,
    MagnifyingGlassIcon
  },
  props: {
    showImport: {
      type: Boolean,
      default: false
    },
    clearOnSelect: {
      type: Boolean,
      default: false
    },
    defaultQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['selected', 'searched'],
  data() {
    return {
      query: '',
      results: [],
      timeout: null,
      selected: null,
      suggestions: [],
      selectIsValid: true
    }
  },
  created() {
    this.query = this.defaultQuery
  },
  methods: {
    searchClick(): void {
      // @ts-ignore
      const id = this.$refs.autosuggest.getSelectedId()
      if (id) {
        this.sendSelect([id])
      } else {
        // @ts-ignore
        let query = this.$refs.autosuggest.query

        if (query) {
          const ids = query.split(',').map((id: string) => id.trim())
          api.getPaperIds(ids).then(ids => {
            if (ids.length > 0) {
              this.sendSelect(ids)
              if (this.clearOnSelect) {
                query = ''
              }
            } else {
              this.sendSearched(query)
            }
          })
        }
      }
    },
    uploadBib(): void {
      // @ts-ignore
      this.$refs.bibUploadInput.click()
    },
    parseBib(event: Event): void {
      // @ts-ignore
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener('load', event => {
          // @ts-ignore
          const ids = bib.idsFromBib(event.target.result)
          this.sendSelect(Array.from(ids))
        })

        // @ts-ignore
        reader.readAsText(event.target.files[0])
      }
    },
    sendSelect(ids: PaperID[]): void {
      this.$emit('selected', ids)
    },
    sendSearched(query: string): void {
      this.$emit('searched', query)
    }
  }
})
</script>
