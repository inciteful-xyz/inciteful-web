<template>
  <ul class="divide-y divide-gray-200">
    <li v-if="errorMsg" class="py-6">Error: {{ errorMsg }}</li>
    <li v-else-if="loading" class="py-6">
      <div class="w-32 m-auto"><Loader /></div>
    </li>
    <li
      v-else-if="!papers || papers.length == 0"
      class="px-6 py-6 sm:px-0 font-semibold"
    >
      We could not find any results. Please check your search and try again.
    </li>
    <li
      v-else
      v-for="(paper, index) in papers"
      class="px-6 py-6 sm:px-0"
      :key="index"
    >
      <div id="paper-info">
        <div class="flex">
          <div v-if="showLitReviewButton" class="flex-none pr-3 w-6">
            <LitReviewButton :ids="[]" :id="paper.id" />
          </div>
          <div class="flex-grow">
            <div class="pr-3">
              <button
                @click="registerSelect(paper)"
                class="
                  hover:underline
                  text-md
                  font-bold
                  leading-tight
                  text-left
                  lg:text-lg
                  text-violet-700
                "
                v-html="paper.title"
              ></button>
            </div>
          </div>
        </div>
        <div class="lg:flex lg:flex-row-reverse">
          <div class="flex-1 lg:text-right mt-2">
            <span v-if="paper.journal" class="italic">{{ paper.journal }}</span>
          </div>
          <div class="flex-1 mt-2 text-gray-500 font-semibold">
            <Authors :authors="paper.author" />
          </div>
        </div>
        <div class="flex pt-3">
          <div class="flex-1 text-xs lg:text-sm">
            <div>
              Year:
              <span class="font-semibold pr-4 text-sm lg:text-base">{{
                paper.published_year
              }}</span>
              Cited By:
              <span class="font-semibold pr-4 text-sm lg:text-base">{{
                paper.num_cited_by
              }}</span>
              Citing:
              <span class="font-semibold pr-4 text-sm lg:text-base">{{
                paper.num_citing
              }}</span>
            </div>
          </div>
          <div class="flex-none pl-4">
            <slot name="action" v-bind:paper="paper">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  @click="registerSelect(paper)"
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
                    bg-violet-600
                    hover:bg-violet-500
                    focus:outline-none
                    focus:border-violet-700
                    focus:ring-violet
                    active:bg-violet-700
                    transition
                    ease-in-out
                    duration-150
                  "
                >
                  View Graph >>
                </button>
              </span>
            </slot>
          </div>
        </div>
      </div>
    </li>
    <li class="px-6 py-6 sm:px-0">
      Search results powered by
      <a
        class="text-violet-500"
        href="https://docs.openalex.org/api-entities/works/search-works"
        >OpenAlex</a
      >.
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Loader from './Loader.vue'
import LitReviewButton from './LitReviewButton.vue'
import Authors from './Authors.vue'
import { Paper } from '@/types/incitefulTypes'
import { searchOpenAlex } from '../utils/openalexApi'

export default defineComponent({
  name: 'SearchResults',
  components: {
    LitReviewButton,
    Loader,
    Authors
  },
  props: {
    showLitReviewButton: {
      type: Boolean,
      default: false
    },
    abstractLength: {
      type: Number,
      default: 300
    },
    query: {} as PropType<string>
  },
  emits: ['selected'],
  data() {
    return {
      papers: undefined as Paper[] | undefined,
      errorMsg: undefined as string | undefined,
      emptyMessage:
        'Your search returned no results, please try a different query.'
    }
  },
  created() {
    this.updateResults()
  },
  watch: {
    query(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.updateResults()
      }
    }
  },
  computed: {
    loading(): boolean {
      if (this.papers) return false
      return true
    }
  },
  methods: {
    updateResults(): void {
      if (this.query) {
        this.papers = undefined
        searchOpenAlex(this.query).then(data => {
          this.papers = data
        })
      }
    },
    registerSelect(paper: Paper): void {
      this.$emit('selected', paper)
    }
  }
})
</script>
