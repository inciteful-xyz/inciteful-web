<template>
  <div class="pt-3">
    <div class="flex flex-col">
      <div class="-my-2 sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="
                shadow
                border-b border-gray-200
                sm:rounded-lg
              ">
            <div class="p-8" v-if="errorMsg">{{ errorMsg }}</div>
            <div class="p-8 flex justify-center" v-else-if="loading">
              <Loader />
            </div>
            <div v-else>
              <table class="base-table overflow-hidden overflow-x-auto">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="pl-3 py-3"></th>
                    <th v-if="hasPaperID()"></th>
                    <th class="whitespace-nowrap" v-for="(column, index) in columns" :key="index">
                      <button @click="sortBy(column)" :class="{ 'font-bold': column == sortedBy }">
                        {{ column }}
                        <ChevronDownIcon v-if="column == sortedBy && sortDescending" class="w-4 h-4 inline" />
                        <ChevronUpIcon class="w-4 h-4 inline" v-if="column == sortedBy && !sortDescending" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!results || results.length == 0">
                    <td class="p-3 text-center">
                      <span v-if="emptyMessage">{{ emptyMessage }}</span><span v-else>No results. Try adjusting your
                        filters.
                      </span>
                    </td>
                  </tr>
                  <tr v-for="(result, index) in pagedResults" :key="index" :class="rowClass(index)">
                    <td v-if="hasPaperID()">
                      <LitReviewButton :ids="ids" :id="(result.paper_id as PaperID)" />
                    </td>

                    <td class="pl-3 py-2 text-left text-sm">
                      <paper-modal-button :class="['block', 'font-semibold', 'pb-2', 'text-left']"
                        :id="(result.paper_id as PaperID)" :contextIds="ids"
                        :text="(result.title ? result.title : result.paper_id) as string" />
                      <div v-if="result.authors">
                        <Authors :authors="(result.authors as Author[])" :ids="ids" />
                      </div>
                      <div v-if="result.affiliation" class="whitespace-nowrap font-semibold text-gray-500">
                        {{ result.affiliation }}
                      </div>
                      <div v-if="result.author_name" class="whitespace-nowrap font-semibold text-gray-500">
                        <Authors :authors="[
                          {
                            author_id: 0,
                            name: result.author_name as string,
                            sequence: 0,
                          }
                        ]" :authorClass="[
  'font-semibold',
  'text-gray-600',
  'underline'
]" :ids="ids" />
                      </div>

                      <span v-if="
                        result.year || result.published_year || result.journal
                      ">
                        {{ result.year ? `(${result.published_year})` : '' }}
                        <i>{{ result.journal }}</i>
                      </span>
                    </td>
                    <td class="whitespace-nowrap text-sm" v-for="(column, index) in columns" :key="index">
                      {{ format(result[column]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex text-sm border-t border-gray-200">
                <div class="flex-auto">
                  <router-link :to="queryLink" title="View SQL" class="p-3 sql-button cursor-pointer inline-block">
                    <DocumentReportIcon class="w-4 h-4 inline" /> SQL
                  </router-link>
                </div>
                <div v-if="numPages > 1" class="flex-none whitespace-nowrap paging">
                  <paginate v-model="currentPage" :pages="numPages" active-color="rgba(139, 92, 246)"
                    :hideFirstButton="true" :hideLastButton="true" @update:modelValue="turnPage">
                  </paginate>
                </div>
                <div class="flex-auto text-right">
                  <SaveDropDown :ids="resultIds" v-if="hasPaperID()" class="pt-2" />
                  <button v-if="canViewGraphs()" v-on:click="viewGraph()" title="ViewGraph" class="p-3">
                    <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                      </path>
                    </svg>
                    Graph
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Authors from './Authors.vue'
import numeral from 'numeral'
import Paginate from '@hennge/vue3-pagination'
import Loader from './Loader.vue'
import LitReviewButton from './LitReviewButton.vue'
import navigation from '../navigation'
import { Author, PaperID } from '@/types/incitefulTypes'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentReportIcon
} from '@heroicons/vue/outline'
import SaveDropDown from './SaveDropDown.vue'
import PaperModalButton from './modals/PaperModalButton.vue'
import { QueryResults } from '../types/incitefulTypes'

export default defineComponent({
  name: 'TableView',
  components: {
    Authors,
    Paginate,
    Loader,
    LitReviewButton,
    ChevronDownIcon,
    ChevronUpIcon,
    DocumentReportIcon,
    SaveDropDown,
    PaperModalButton
  },
  props: {
    results: {} as PropType<QueryResults>,
    errorMsg: {} as PropType<string | undefined>,
    sql: {} as PropType<string | undefined>,
    loading: {} as PropType<boolean>,
    ids: {} as PropType<PaperID[]>,
    filters: {} as PropType<Record<string, string>>,
    emptyMessage: String,
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1,
      sortedBy: undefined as string | undefined,
      sortDescending: undefined as boolean | undefined
    }
  },
  watch: {
    results: function () {
      this.currentPage = 1
    }
  },
  computed: {
    columns(): string[] | undefined {
      if (this.results) {
        return this.getColumnNames(this.results)
      }

      return undefined
    },
    numPages(): number {
      if (this.results) {
        return Math.ceil(this.results.length / this.pageSize)
      } else {
        return 0
      }
    },
    sortedResults(): QueryResults | undefined {
      if (
        this.sortedBy !== undefined &&
        this.results &&
        this.results.length > 0
      ) {
        const sorted = [...this.results].sort((a, b) => {
          var res = 0

          if (this.sortedBy !== undefined) {
            if (a[this.sortedBy] > b[this.sortedBy]) {
              res = 1
            }
            if (a[this.sortedBy] < b[this.sortedBy]) {
              res = -1
            }

            if (this.sortDescending) {
              res = res * -1
            }
          }

          return res
        })
        return sorted
      }
      return this.results
    },
    pagedResults(): QueryResults | undefined {
      if (this.sortedResults) {
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return this.sortedResults.slice(start, end)
      }

      return undefined
    },
    queryLink(): unknown {
      if (this.ids && this.ids.length === 1) {
        return {
          path: navigation.getPaperQueryUrl(this.ids[0]),
          query: { sql: this.sql }
        }
      } else {
        return {
          name: 'LitReviewQuery',
          query: {
            ids: this.ids,
            sql: this.sql
          }
        }
      }
    },
    resultIds(): PaperID[] {
      if (this.results && this.hasPaperID())
        return this.results.map(p => p.paper_id as PaperID)
      else return []
    }
  },
  methods: {
    format(val: unknown): string {
      if (typeof val === 'number') {
        return numeral(val).format('0.[000000]')
      } else if (typeof val === 'string') {
        return val
      } else {
        return ''
      }
    },
    rowClass(index: number): string {
      return index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
    },
    getColumnNames(val: QueryResults): string[] {
      if (
        typeof val !== 'object' ||
        val.length === 0 ||
        val[0] === undefined ||
        typeof val[0] !== 'object'
      ) {
        return []
      }

      const cols = Object.keys(val[0])
      const specialCols = [
        'authors',
        'doi',
        'title',
        'journal',
        'author_name',
        'paper_id',
        'affiliation'
      ]
      return cols.filter(v => !specialCols.includes(v))
    },

    hasPaperID(): boolean {
      return (
        this.results !== undefined &&
        this.results.length > 0 &&
        typeof this.results[0] === 'object' &&
        this.results[0].paper_id !== undefined
      )
    },
    canViewGraphs(): boolean {
      // return this.hasPaperID() && options.getGraphStatus();
      return false
    },
    viewGraph(): void {
      if (this.results) {
        const ids = [...(this.ids ?? [])]
        this.results.forEach(r => {
          if (ids.indexOf(r.paper_id as PaperID) === -1) {
            ids.push(r.paper_id as PaperID)
          }
        })
      }
    },
    turnPage(pageNum: number): void {
      this.currentPage = pageNum
    },
    sortBy(column: string): void {
      if ((this.sortedBy = column)) {
        this.sortDescending = !this.sortDescending
      } else {
        this.sortedBy = column
      }
      this.currentPage = 1
    }
  }
})
</script>
