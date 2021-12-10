<template>
  <div class="pt-3">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
            "
          >
            <div class="p-8" v-if="errorMsg">{{ errorMsg }}</div>
            <div class="p-8 flex justify-center" v-else-if="loading">
              <Loader />
            </div>
            <div v-else>
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="pl-3 py-3 bg-gray-50"></th>
                    <th class="bg-gray-50" v-if="hasPaperID()"></th>
                    <th
                      class="
                        px-2
                        py-2
                        bg-gray-50
                        text-right text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                        whitespace-nowrap
                      "
                      v-for="(column, index) in columns"
                      :key="index"
                    >
                      <button
                        @click="sortBy(column)"
                        :class="{ 'font-bold': column == sortedBy }"
                      >
                        {{ column }}
                        <span v-if="column == sortedBy && sortDescending">
                          <svg
                            class="w-4 h-4 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </span>
                        <span v-if="column == sortedBy && !sortDescending">
                          <svg
                            class="w-4 h-4 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 15l7-7 7 7"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="!results || results.length == 0">
                    <td class="p-3 text-center">
                      <span v-if="emptyMessage">{{ emptyMessage }}</span
                      ><span v-else
                        >No results. Try adjusting your filters.
                      </span>
                    </td>
                  </tr>
                  <tr
                    v-for="(result, index) in pagedResults"
                    :key="index"
                    :class="rowClass(index)"
                  >
                    <td v-if="hasPaperID()" class="pl-3 py-2">
                      <LitReviewButton :ids="ids" :id="result.paper_id" />
                    </td>

                    <td class="pl-3 py-2 text-sm sm:text-md">
                      <button
                        v-if="result.title || result.paper_id"
                        v-on:click="showModal(result['paper_id'])"
                        class="underline block font-semibold pb-2 text-left"
                      >
                        {{ result.title ? result.title : result.paper_id }}
                      </button>
                      <div
                        v-if="result.authors"
                        class="font-semibold text-gray-500"
                      >
                        <Author :authors="result.authors" :ids="ids" />
                      </div>
                      <div
                        v-if="result.name"
                        class="whitespace-nowrap font-semibold text-gray-500"
                      >
                        {{ result.name }}
                      </div>
                      <span
                        v-if="
                          result.year || result.published_year || result.journal
                        "
                      >
                        {{ result.year ? `(${result.published_year})` : '' }}
                        <i>{{ result.journal }}</i>
                      </span>
                    </td>
                    <td
                      class="
                        px-3
                        py-2
                        whitespace-nowrap
                        text-sm text-right
                        leading-5
                        text-gray-500
                      "
                      v-for="(column, index) in columns"
                      :key="index"
                    >
                      {{ format(result[column]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex text-sm border-t border-gray-200">
                <div class="flex-auto">
                  <router-link
                    :to="queryLink"
                    title="View SQL"
                    class="p-3 sql-button cursor-pointer inline-block"
                  >
                    <svg
                      class="w-4 h-4 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    SQL
                  </router-link>
                </div>
                <div
                  v-if="numPages > 1"
                  class="flex-none whitespace-nowrap paging"
                >
                  <paginate
                    :page-count="numPages"
                    :click-handler="turnPage"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pager'"
                  >
                  </paginate>
                </div>
                <div class="flex-auto text-right">
                  <button
                    v-if="hasPaperID()"
                    v-on:click="downloadBibFile()"
                    title="Download Bibtex File"
                    class="p-3 bibtex-export"
                  >
                    <svg
                      class="w-4 h-4 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    BibTeX
                  </button>
                  <button
                    v-if="canViewGraphs()"
                    v-on:click="viewGraph()"
                    title="ViewGraph"
                    class="p-3 bibtex-export"
                  >
                    <svg
                      class="w-4 h-4 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
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
import Vue, { PropType } from 'vue'
import Author from './Authors.vue'
import numeral from 'numeral'
import api from '../utils/api'
import bus from '../utils/bus'
import Paginate from 'vuejs-paginate'
import Loader from './Loader.vue'
import LitReviewButton from './LitReviewButton.vue'
import navigation from '../navigation'
import { PaperID } from '@/types/inciteful'

export default Vue.extend({
  name: 'TableView',
  components: {
    Author,
    Paginate,
    Loader,
    LitReviewButton
  },
  props: {
    results: {} as PropType<any[]>,
    errorMsg: {} as PropType<string | undefined>,
    sql: {} as PropType<string | undefined>,
    loading: {
      type: Boolean,
      default () {
        return true
      }
    },
    ids: {} as PropType<PaperID[]>,
    filters: {} as PropType<Record<string, string>>,
    emptyMessage: String,
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      bus,
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
    columns (): string[] | undefined {
      if (this.results) {
        return this.getColumnNames(this.results)
      }

      return undefined
    },
    numPages (): number {
      if (this.results) {
        return Math.ceil(this.results.length / this.pageSize)
      } else {
        return 0
      }
    },
    sortedResults (): any[] | undefined {
      if (
        this.sortedBy !== undefined &&
        this.results &&
        this.results.length > 0
      ) {
        const sorted = [...this.results].sort((a, b) => {
          if (this.sortedBy !== undefined) {
            if (this.sortDescending) {
              return b[this.sortedBy] - a[this.sortedBy]
            } else {
              return a[this.sortedBy] - b[this.sortedBy]
            }
          } else {
            return 0
          }
        })
        return sorted
      }
      return this.results
    },
    pagedResults (): any[] | undefined {
      if (this.sortedResults) {
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return this.sortedResults.slice(start, end)
      }

      return undefined
    },
    queryLink (): any {
      if (this.ids.length === 1) {
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
    }
  },
  methods: {
    format (val: any): string {
      return typeof val === 'number' ? numeral(val).format('0.[000000]') : val
    },
    rowClass (index: number): string {
      return index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
    },
    getColumnNames (val: any): string[] {
      if (typeof val !== 'object' || val.length === 0 || val[0] === undefined) {
        return []
      }
      const cols = Object.keys(val[0])
      const specialCols = [
        'authors',
        'doi',
        'title',
        'journal',
        'name',
        'paper_id'
      ]
      return cols.filter(v => !specialCols.includes(v))
    },
    hasPaperID (): boolean {
      return (
        this.results &&
        this.results.length > 0 &&
        this.results[0].paper_id !== undefined
      )
    },
    canViewGraphs (): boolean {
      // return this.hasPaperID() && options.getGraphStatus();
      return false
    },
    viewGraph (): void {
      const ids = [...this.ids]
      this.results.forEach(r => {
        if (ids.indexOf(r.paper_id) === -1) {
          ids.push(r.paper_id)
        }
      })

      bus.$emit('render_graph', ids)
    },
    downloadBibFile (): void {
      const ids = new Set<PaperID>()

      if (this.hasPaperID()) {
        this.results.forEach(x => ids.add(x.paper_id))
      }

      api.downloadBibFile(Array.from(ids))
    },
    turnPage (pageNum: number): void {
      this.currentPage = pageNum
    },
    sortBy (column: string): void {
      if ((this.sortedBy = column)) {
        this.sortDescending = !this.sortDescending
      } else {
        this.sortedBy = column
      }
      this.currentPage = 1
    },
    showModal (id: PaperID): void {
      const options = {
        paperId: id,
        connectTo: undefined as undefined | PaperID
      }

      if (this.ids.length === 1) {
        options.connectTo = this.ids[0]
      }
      bus.$emit('show_paper_modal', options)
    }
  }
})
</script>
<style lang="scss">
.pager {
  @apply py-4;
}
.pager li {
  @apply inline;
}
.pager li a {
  @apply p-2 border-gray-200 border rounded m-1;
}

.pager .active a {
  @apply bg-purple-500 border-purple-800 text-white;
}
</style>
