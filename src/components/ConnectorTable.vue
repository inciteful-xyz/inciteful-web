<template>
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200 border-collapse">
      <thead>
        <tr>
          <th class="pl-3 py-3 bg-gray-50"></th>
          <th class="bg-gray-50"></th>
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
              <ChevronDownIcon
                v-if="column.name == sortedBy && sortDescending"
                class="w-4 h-4 inline"
              />
              <ChevronUpIcon
                v-if="column.name == sortedBy && !sortDescending"
                class="w-4 h-4 inline"
              />
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
          <td class="pl-3 py-2">
            <LitReviewButton :id="p[idColName]" />
          </td>
          <td class="pl-3 py-2 text-sm sm:text-md">
            <button
              v-on:click="
                this.emitter.emit('show_paper_modal', {
                  paperId: p.id,
                  graphIds: this.papers.map(x => x.id)
                })
              "
              class="underline block font-semibold pb-2 text-left"
            >
              {{ p.title }}
            </button>
            <div v-if="p.author" class="font-semibold text-gray-500">
              <Authors :authors="p.author" />
            </div>
            <span>
              <i>{{ p.journal }}</i
              >{{ p.published_year && p.journal ? ',' : '' }}
              {{ p.published_year ? `${p.published_year}` : '' }}
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
              <LockClosedIcon v-if="p.isLocked" class="w-6 h-6" />
              <LockOpenIcon v-if="p.isLocked" class="w-6 h-6" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex text-sm border-t border-gray-200">
      <div class="flex-auto"></div>
      <div v-if="numPages > 1" class="flex-none whitespace-nowrap paging">
        <paginate
          :page="numPages"
          :click-handler="turnPage"
          @update:modelValue="turnPage"
        >
        </paginate>
      </div>
      <div class="flex-auto text-right">
        <button
          v-on:click="downloadBibFile()"
          title="Download Bibtex File"
          class="p-3 bibtex-export"
        >
          <DocumentDownloadIcon class="w-4 h-4 inline" /> BibTeX
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
// @ts-ignore
import Paginate from '@hennge/vue3-pagination'
import Authors from './Authors.vue'
import LitReviewButton from './LitReviewButton.vue'
import api from '../utils/api'
import { Paper, PaperID } from '@/types/inciteful'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LockClosedIcon,
  LockOpenIcon,
  DocumentDownloadIcon
} from '@heroicons/vue/outline'

export default defineComponent({
  name: 'ConnectorTable',
  components: {
    Paginate,
    Authors,
    LitReviewButton,
    ChevronDownIcon,
    ChevronUpIcon,
    LockClosedIcon,
    LockOpenIcon,
    DocumentDownloadIcon
  },
  props: {
    papers: {} as PropType<Paper[]>,
    pageSize: {
      type: Number,
      default: 10
    },
    idColName: {
      type: String,
      default: 'id'
    }
  },
  watch: {
    papers (newVal, oldVal) {
      if (newVal !== oldVal) this.currentPage = 1
    }
  },
  emits: ['mouseoverRow', 'mouseleaveRow', 'lockPaper'],
  data () {
    return {
      currentPage: 1,
      sortedBy: '' as string,
      sortDescending: undefined as boolean | undefined,
      columns: [
        { name: 'path_count', displayName: 'Paths' },
        { name: 'distance', displayName: 'Distance' },
        { name: 'num_cited_by', displayName: 'Citations' }
      ]
    }
  },
  computed: {
    numPages (): number {
      if (this.papers) {
        return Math.ceil(this.papers.length / this.pageSize)
      } else {
        return 0
      }
    },
    sortedResults (): Paper[] {
      const sorted = [...(this.papers ?? [])]
      if (this.sortedBy && this.papers && this.papers.length > 0) {
        sorted.sort((a, b) => {
          if (this.sortDescending) {
            return (b as any)[this.sortedBy] - (a as any)[this.sortedBy]
          } else {
            return (a as any)[this.sortedBy] - (b as any)[this.sortedBy]
          }
        })
      }

      sorted.sort((a, b) => {
        return (b as any).isLocked - (a as any).isLocked
      })
      return sorted
    },
    pagedResults (): Paper[] {
      if (this.sortedResults) {
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return this.sortedResults.slice(start, end)
      } else return []
    }
  },
  methods: {
    rowClass (index: number, isLocked: boolean): Record<string, boolean> {
      return {
        'bg-white': index % 2 === 0 && !isLocked,
        'bg-gray-50': index % 2 !== 0 && !isLocked,
        'border-2': isLocked,
        'border-purple-300': isLocked,
        'bg-purple-100': isLocked
      }
    },
    downloadBibFile (): void {
      if (this.papers) {
        const ids = new Set<PaperID>()

        this.papers.forEach(x => ids.add(x.id))

        api.downloadBibFile(Array.from(ids))
      }
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
    }
  }
})
</script>
