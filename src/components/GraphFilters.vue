<template>
  <div class="lg:flex">
    <div
      id="graph-filters"
      class="lg:flex-1 border-b pb-5 mb-5 lg:border-b-0 lg:mb-0 lg:pb-0"
    >
      <h3 class="text-gray-700 text-base font-semibold">
        Paper Filters
        <a
          class="text-violet-700"
          href="https://help.inciteful.xyz/power-users.html#graph-filters"
          target="_blank"
          ><InformationCircleIcon class="w-5 h-5 inline" />
        </a>
      </h3>
      <form class="w-full pt-2 lg:flex flex-wrap">
        <div class="flex-grow pb-3 pr-3">
          <label
            for="keywordFilter"
            class="block text-sm leading-5 font-medium text-gray-800"
            >Keywords</label
          >
          <div class="relative mt-1">
            <input
              type="text"
              v-on:keyup.enter="applyFilters()"
              ref="keywordFilter"
              class="shadow-sm focus:ring-violet-500 focus:border-violet-500 block sm:text-sm border-gray-300 rounded-md w-full"
              placeholder="(hello AND world) NOT cruel"
              v-model="keywords"
            />
          </div>
        </div>
        <div class="flex-wrap flex lg:whitespace-nowrap">
          <div class="flex-none mb-3">
            <div class="inline-block">
              <label
                for="minDistance"
                class="block text-sm leading-5 font-medium text-gray-800"
                >Min Distance</label
              >
              <select
                ref="minDistanceFilter"
                class="
                  mt-1
                  block
                  pl-3
                  pr-10
                  py-2
                  text-base
                  border-gray-300
                  focus:outline-none
                  focus:ring-violet
                  focus:border-violet-300
                  sm:text-sm
                  w-24
                  rounded-md
                "
                v-model="minDistance"
              >
                <option>0</option>
                <option selected>1</option>
                <option>2</option>
              </select>
            </div>
            <div class="inline-block px-3">
              <label
                for="maxDistance"
                class="block text-sm leading-5 font-medium text-gray-800"
                >Max Distance</label
              >
              <select
                ref="maxDistanceFilter"
                class="
                  mt-1
                  block
                  pl-3
                  pr-10
                  py-2
                  text-base
                  border-gray-300
                  focus:outline-none
                  focus:ring-violet
                  focus:border-violet-300
                  sm:text-sm
                  sm:leading-5
                  w-24
                  rounded-md
                "
                v-model="maxDistance"
              >
                <option>0</option>
                <option>1</option>
                <option selected>2</option>
              </select>
            </div>
          </div>
          <div class="flex-none">
            <div class="inline-block">
              <label
                for="minYear"
                class="block text-sm font-medium leading-5 text-gray-800"
                >Min Year</label
              >
              <div class="mt-1">
                <input
                  ref="minYearFilter"
                  type="text"
                  class="shadow-sm focus:ring-violet-500 focus:border-violet-500 block sm:text-sm border-gray-300 rounded-md w-20"
                  maxlength="4"
                  v-on:keyup.enter="applyFilters()"
                  placeholder="2015"
                  v-model="minYear"
                />
              </div>
            </div>
            <div class="inline-block px-3">
              <label
                for="maxYear"
                class="block text-sm font-medium leading-5 text-gray-800"
                >Max Year</label
              >
              <div class="mt-1">
                <input
                  ref="maxYearFilter"
                  type="text"
                  class="shadow-sm focus:ring-violet-500 focus:border-violet-500 block sm:text-sm border-gray-300 rounded-md w-20"
                  maxlength="4"
                  v-on:keyup.enter="applyFilters()"
                  placeholder="2015"
                  v-model="maxYear"
                />
              </div>
            </div>
            <div class="inline-block">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  @click="applyFilters()"
                  class="button-violet text-sm"
                >
                  Filter
                </button>
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div
      v-if="!hideAddSingle"
      class="lg:flex-1 pl-0 ml-0 lg:pl-5 lg:ml-5 lg:border-l"
    >
      <h3 class="text-gray-700 text-base font-semibold pb-2">
        Add Papers to the Graph
      </h3>
      <label
        for="keywordFilter"
        class="block text-sm leading-5 font-medium text-gray-800"
        >Paper Title or DOI</label
      >
      <div class="mt-1">
        <GraphSearch
          :key="'filters'"
          :showImport="true"
          :clearOnSelect="true"
          @selected="addToLitReview"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GraphSearch from './GraphSearch.vue'
import { PaperID } from '@/types/incitefulTypes'
import { InformationCircleIcon } from '@heroicons/vue/outline'
import { addToLitReviewHelper } from '@/utils/emitHelpers'

export default defineComponent({
  name: 'GraphFilters',
  components: { GraphSearch, InformationCircleIcon },
  props: {
    hideAddSingle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keywords: this.$route.query.keyword,
      minDistance: this.$route.query.minDistance,
      maxDistance: this.$route.query.maxDistance,
      minYear: this.$route.query.minYear,
      maxYear: this.$route.query.maxYear
    }
  },
  methods: {
    addToLitReview(ids: PaperID[]): void {
      ids.map(id => addToLitReviewHelper(id))
    },
    applyFilters() {
      this.$router.push({
        query: {
          ...this.$route.query,
          keywords: this.keywords,
          minDistance: this.minDistance,
          maxDistance: this.maxDistance,
          minYear: this.minYear,
          maxYear: this.maxYear
        }
      })
    }
  }
})
</script>
