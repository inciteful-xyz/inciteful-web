<template>
  <ul class="divide-y divide-gray-200">
    <li v-if="errorMsg" class="py-6">Error: {{ errorMsg }}</li>
    <li v-else-if="loading" class="py-6">
      <div class="w-32 m-auto"><Loader /></div>
    </li>
    <li v-else-if="papers.length == 0" class="px-6 py-6 sm:px-0 font-semibold">
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
            <h1 class="pr-3">
              <button
                @click="registerSelect(paper)"
                class="
                  hover:underline
                  text-md
                  font-bold
                  leading-tight
                  text-left
                  lg:text-lg
                  text-purple-700
                "
              >
                {{ paper.title }}
              </button>
            </h1>
          </div>
        </div>
        <div class="lg:flex lg:flex-row-reverse">
          <div class="flex-1 lg:text-right mt-2">
            <span v-if="paper.conference_instance_name" class="italic">{{
              paper.conference_instance_name
            }}</span
            ><span v-if="paper.book_title" class="italic">{{
              paper.book_title
            }}</span
            ><span v-if="paper.journal" class="italic">{{ paper.journal }}</span
            ><span v-if="paper.volume">, vol {{ paper.volume }}</span
            ><span v-if="paper.issue"> no {{ paper.issue }}.</span>
          </div>
          <div class="flex-1 mt-2 text-gray-500 font-semibold">
            <Authors :authors="paper.author" />
          </div>
        </div>
        <div class="flex pt-3">
          <div class="flex-1 text-xs lg:text-sm">
            <div v-if="showAbstract" class="pb-3">
              <AbstractView
                :abstract="paper.abstract"
                :length="abstractLength"
              />
            </div>
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
      <a class="text-purple-500" href="https://lens.org">The Lens</a>.
    </li>
  </ul>
</template>
<script>
import api from '../utils/api'
import AbstractView from './AbstractView'
import Loader from './Loader'
import LitReviewButton from './LitReviewButton'
import Authors from './Authors'

export default {
  name: 'SearchResults',
  components: {
    AbstractView,
    LitReviewButton,
    Loader,
    Authors
  },
  props: {
    showLitReviewButton: {
      type: Boolean,
      default: false
    },
    showAbstract: {
      type: Boolean,
      default: true
    },
    abstractLength: {
      type: Number,
      default: 300
    },
    query: {
      type: String,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      papers: undefined,
      errorMsg: undefined,
      emptyMessage:
        'Your search returned no results, please try a different query.'
    }
  },
  created () {
    this.updateResults()
  },
  watch: {
    query (newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.updateResults()
      }
    }
  },
  computed: {
    loading () {
      if (this.papers) return false
      return true
    }
  },
  methods: {
    updateResults () {
      if (this.query) {
        api.searchLensPapers(this.query).then(data => {
          this.papers = data
        })
      }
    },
    registerSelect (paper) {
      this.$emit('selected', paper)
    }
  }
}
</script>
