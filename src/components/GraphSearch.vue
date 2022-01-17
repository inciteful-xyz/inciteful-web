<template>
  <div class="w-full">
    <div class="flex whitespace-nowrap">
      <div class="w-full text-right">
        <Autosuggest
          ref="autosuggest"
          :defaultQuery="defaultQuery"
          @selected="sendSelect"
          @searched="sendSearched"
        />
        <div v-if="showImport" class="text-right pt-1 text-sm">
          <input
            type="file"
            style="display: none"
            ref="bibUploadInput"
            accept=".bib"
            @change="parseBib"
          />
          or
          <button class="underline hover:no-underline" @click="uploadBib">
            Import BibTeX file
          </button>
        </div>
      </div>
      <span class="rounded-md shadow-sm pl-2">
        <button
          type="button"
          class="
            px-3
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
          v-on:click="searchClick"
        >
          <svg
            class="h-5 w-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import api from '@/utils/api'
import bib from '@/utils/bib'
import Autosuggest from './Autosuggest.vue'
import { PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'GraphSearch',
  components: {
    Autosuggest
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
  data () {
    return {
      query: '',
      results: [],
      timeout: null,
      selected: null,
      suggestions: [],
      selectIsValid: true
    }
  },
  created () {
    this.query = this.defaultQuery
  },
  methods: {
    searchClick (): void {
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
    uploadBib (): void {
      // @ts-ignore
      this.$refs.bibUploadInput.click()
    },
    parseBib (event: Event): void {
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
    sendSelect (ids: PaperID[]): void {
      api.getPaperIds(ids).then(ids => {
        this.$emit('selected', ids)
      })
    },
    sendSearched (query: string): void {
      this.$emit('searched', query)
    }
  }
})
</script>
