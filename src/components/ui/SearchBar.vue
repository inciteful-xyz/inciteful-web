<template>
  <div :class="containerClass" @focusout="onFocusOut">
    <div :class="[wrapperClass, 'relative']">
      <!-- Search Icon -->
      <div :class="iconContainerClass">
        <svg :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <!-- Autosuggest Input -->
      <div class="flex-1 min-w-0" @keydown.esc="hideResults">
        <input
          ref="searchInput"
          type="text"
          :placeholder="placeholder"
          :class="inputClass"
          :value="query"
          @input="onInput"
          @click="showResults = true"
          @focus="onFocus"
          @keydown.up.prevent="registerKeypress('up')"
          @keydown.down.prevent="registerKeypress('down')"
          @keydown.enter.prevent="handleEnter"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          :aria-expanded="shouldShowResults"
          :aria-controls="resultsId"
          :aria-activedescendant="highlighted !== null ? `${resultsId}-${highlighted}` : undefined"
          aria-label="Search for papers"
        />
      </div>

      <!-- Search Button -->
      <button
        type="button"
        @click="handleSearch"
        :class="buttonClass"
      >
        <span v-if="!compact" class="hidden sm:inline">Search</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Results Dropdown -->
      <div
        v-if="shouldShowResults"
        class="absolute left-0 right-0 top-full z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
      >
        <ul :id="resultsId" role="listbox" class="list-none p-0 m-0">
          <SearchResultItem
            v-for="(result, index) in results"
            :key="result.id"
            :result="result"
            :item-id="`${resultsId}-${index}`"
            :is-highlighted="highlighted === index"
            @select="selectResult(index)"
          />
        </ul>
      </div>
    </div>

    <!-- Import BibTeX link -->
    <div v-if="showImport" class="text-center pt-3 text-sm text-theme-charcoal">
      <input type="file" style="display: none" ref="bibUploadInput" accept=".bib" @change="parseBib" />
      or
      <button class="text-theme-violet hover:underline font-medium" @click="uploadBib">
        Import BibTeX file
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { searchOpenAlex } from '@/utils/openalexApi'
import api from '@/utils/incitefulApi'
import bib from '@/utils/bib'
import SearchResultItem from '@/components/ui/SearchResultItem.vue'
import { Paper, PaperID } from '@/types/incitefulTypes'

interface Props {
  showImport?: boolean
  compact?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  showImport: false,
  compact: false,
  placeholder: 'Paper title, DOI, PubMed URL, or arXiv URL'
})

const emit = defineEmits<{
  selected: [ids: PaperID[]]
  searched: [query: string]
}>()

// Generate unique ID for accessibility
const resultsId = `search-results-${Math.random().toString(36).substr(2, 9)}`

const query = ref('')
const results = ref<Paper[]>([])
const showResults = ref(true)
const isFocused = ref(false)
const highlighted = ref<number | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const bibUploadInput = ref<HTMLInputElement | null>(null)

let timeout: number | null = null
const debounceMilliseconds = 200

// Computed classes based on compact prop
const containerClass = computed(() =>
  props.compact ? 'w-full max-w-lg' : 'w-full max-w-4xl mb-8 px-2 sm:px-0'
)

const wrapperClass = computed(() =>
  props.compact
    ? 'flex gap-1 p-1 bg-white border-2 border-theme-violet rounded-xl shadow-md'
    : 'flex gap-2 p-1 sm:p-2 bg-white border-2 border-theme-violet rounded-2xl shadow-lg'
)

const iconContainerClass = computed(() =>
  props.compact ? 'flex items-center pl-2' : 'flex items-center pl-2 sm:pl-4'
)

const iconClass = computed(() =>
  props.compact ? 'w-4 h-4 text-theme-violet' : 'w-5 h-5 sm:w-6 sm:h-6 text-theme-violet'
)

const inputClass = computed(() =>
  props.compact
    ? 'w-full px-2 py-1.5 text-sm outline-none border-none focus:ring-0 bg-transparent'
    : 'w-full px-2 py-2 sm:py-3 text-sm sm:text-lg outline-none border-none focus:ring-0 bg-transparent'
)

const buttonClass = computed(() =>
  props.compact
    ? 'p-1.5 bg-theme-violet text-white rounded-lg hover:bg-theme-violet-2 transition-colors flex items-center justify-center'
    : 'p-2 sm:px-6 sm:py-3 bg-theme-violet text-white font-semibold rounded-xl hover:bg-theme-violet-2 transition-colors flex items-center justify-center gap-2'
)

const shouldShowResults = computed(() => {
  return showResults.value && isFocused.value && results.value.length > 0
})

watch(query, (newVal) => {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = window.setTimeout(() => {
    searchOpenAlex(newVal).then(papers => {
      if (papers && papers.length > 0) {
        results.value = papers.slice(0, 10)
        showResults.value = true
      }
    })
  }, debounceMilliseconds)
})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  query.value = target.value
  highlighted.value = null
}

function onFocus() {
  isFocused.value = true
  showResults.value = true
}

function hideResults() {
  showResults.value = false
  highlighted.value = null
}

function onFocusOut(e: FocusEvent) {
  // Check if the new focus target is outside the component
  const container = e.currentTarget as HTMLElement
  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (!relatedTarget || !container.contains(relatedTarget)) {
    // Small delay to allow click events to fire first
    setTimeout(() => {
      isFocused.value = false
      hideResults()
    }, 150)
  }
}

function registerKeypress(direction: 'up' | 'down') {
  if (results.value && results.value.length > 0) {
    showResults.value = true
    if (highlighted.value === null) {
      highlighted.value = direction === 'down' ? 0 : results.value.length - 1
    } else if (direction === 'down') {
      highlighted.value = (highlighted.value + 1) % results.value.length
    } else {
      highlighted.value = highlighted.value - 1
      if (highlighted.value < 0) {
        highlighted.value = results.value.length - 1
      }
    }
  }
}

function selectResult(index: number) {
  const paper = results.value[index]
  if (paper) {
    showResults.value = false
    searchInput.value?.blur()
    emit('selected', [paper.id])
    query.value = `${paper.title} (${paper.id})`
  }
}

function handleEnter() {
  if (highlighted.value !== null && highlighted.value >= 0) {
    selectResult(highlighted.value)
  } else {
    handleSearch()
  }
}

function handleSearch() {
  if (highlighted.value !== null && results.value[highlighted.value]) {
    selectResult(highlighted.value)
  } else if (query.value) {
    const ids = query.value.split(',').map((id: string) => id.trim())
    api.getPaperIds(ids).then(paperIds => {
      if (paperIds.length > 0) {
        emit('selected', paperIds)
      } else {
        emit('searched', query.value)
      }
    })
    showResults.value = false
    searchInput.value?.blur()
  }
}

function uploadBib() {
  bibUploadInput.value?.click()
}

function parseBib(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      const ids = bib.idsFromBib((e.target as FileReader).result as string)
      emit('selected', Array.from(ids))
    })
    reader.readAsText(target.files[0])
  }
}
</script>

<style scoped>
input::placeholder {
  color: #9F89CE;
}
</style>
