<template>
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200 border-collapse">
      <thead>
        <tr>
          <th class="pl-3 py-3 bg-gray-50"></th>
          <th class="bg-gray-50" v-if="hasID()"></th>
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
              @click="sortBy(column.name)"
              :class="{ 'font-bold': column.name == sortedBy }"
            >
              {{ column.displayName }}
              <span v-if="column.name == sortedBy && sortDescending">
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
              <span v-if="column.name == sortedBy && !sortDescending">
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
          <th class="pl-3 py-3 bg-gray-50"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(p, index) in pagedResults"
          :key="index"
          :class="rowClass(index, p.isLocked)"
          @mouseover="$emit('mouseoverRow', p[idColName])"
          @mouseleave="$emit('mouseleaveRow', p[idColName])"
        >
          <td v-if="hasID()" class="pl-3 py-2">
            <LitReviewButton :id="p[idColName]" />
          </td>
          <td class="pl-3 py-2 text-sm sm:text-md">
            <button
              v-on:click="bus.$emit('show_paper_modal', p.id)"
              class="underline block font-semibold pb-2 text-left"
            >
              {{ p.title }}
            </button>
            <div v-if="p.author" class="font-semibold text-gray-500">
              <Authors :authors="p.author" />
            </div>
            <span>
              <i>{{ p.journal }}</i
              >{{ p.published_year && p.journal ? "," : "" }}
              {{ p.published_year ? `${p.published_year}` : "" }}
            </span>
          </td>

          <td
            v-for="(column, index) in columns"
            :key="index"
            class="
              px-3
              py-2
              whitespace-nowrap
              text-sm text-right
              leading-5
              text-gray-500
            "
          >
            {{ p[column.name] }}
          </td>
          <td class="text-purple-600 px-2">
            <button
              v-on:click="$emit('lockPaper', p.id)"
              class="underline block font-semibold pb-2 text-left graph-lock"
              :title="
                p.isLocked
                  ? 'Unlock the graph from this paper'
                  : 'Lock the graph to this paper'
              "
            >
              <svg
                v-if="!p.isLocked"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                ></path>
              </svg>
              <svg
                v-if="p.isLocked"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex text-sm border-t border-gray-200">
      <div class="flex-auto"></div>
      <div v-if="numPages > 1" class="flex-none whitespace-nowrap paging">
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
      </div>
    </div>
  </div>
</template>
<script>
import Paginate from 'vuejs-paginate'
import Authors from './Authors'
import LitReviewButton from './LitReviewButton'
import bus from '../utils/bus'
import api from '../utils/api'

export default {
  name: 'ConnectorTable',
  components: {
    Paginate,
    Authors,
    LitReviewButton
  },
  props: {
    papers: Array,
    pageSize: {
      type: Number,
      default: 10
    },
    idColName: {
      type: String,
      default: 'id'
    },
    columns: {
      type: Array,
      default () {
        return [
          { name: 'path_count', displayName: 'Paths' },
          { name: 'distance', displayName: 'Distance' },
          { name: 'num_cited_by', displayName: 'Citations' }
        ]
      }
    }
  },
  watch: {
    papers (newVal, oldVal) {
      if (newVal !== oldVal) this.currentPage = 1
    }
  },
  data () {
    return {
      bus,
      currentPage: 1,
      sortedBy: undefined,
      sortDescending: undefined
    }
  },
  computed: {
    numPages () {
      if (this.papers) {
        return Math.ceil(this.papers.length / this.pageSize)
      } else {
        return 0
      }
    },
    sortedResults () {
      const sorted = [...this.papers]
      if (this.sortedBy && this.papers && this.papers.length > 0) {
        sorted.sort((a, b) => {
          if (this.sortDescending) {
            return b[this.sortedBy] - a[this.sortedBy]
          } else {
            return a[this.sortedBy] - b[this.sortedBy]
          }
        })
      }
      sorted.sort((a, b) => {
        return b.isLocked - a.isLocked
      })
      return sorted
    },
    pagedResults () {
      if (this.sortedResults) {
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return this.sortedResults.slice(start, end)
      } else return []
    }
  },
  methods: {
    rowClass (index, isLocked) {
      return {
        'bg-white': index % 2 === 0 && !isLocked,
        'bg-gray-50': index % 2 !== 0 && !isLocked,
        'border-2': isLocked,
        'border-purple-300': isLocked,
        'bg-purple-100': isLocked
      }
    },
    hasID () {
      return (
        this.papers.length > 0 && this.papers[0][this.idColName] !== undefined
      )
    },
    downloadBibFile () {
      const ids = new Set()

      this.papers.forEach((x) => ids.add(x.id))

      api.downloadBibFile(ids)
    },
    turnPage (pageNum) {
      this.currentPage = pageNum
    },
    sortBy (column) {
      if ((this.sortedBy = column)) {
        this.sortDescending = !this.sortDescending
      } else {
        this.sortedBy = column
      }
      this.currentPage = 1
    }
  }
}
</script>
