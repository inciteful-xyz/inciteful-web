<template>
  <div class="text-sm">
    <h1 class="text-gray-800 font-bold text-lg sm:text-2xl pb-5">
      Seed Papers
    </h1>

    <div
      v-if="ids.length < 5"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-5"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm leading-5 text-yellow-700">
            When creating your own graph recommend you have at least five seed
            papers to ensure quality results.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="papers"
      class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mb-3"
    >
      <table class="min-w-full divide-y divide-gray-200 table-auto">
        <thead>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-left text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          ></th>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-left text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            Title
          </th>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-center text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            First Author
          </th>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-center text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            Year
          </th>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-center text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            Cited By
          </th>
          <th
            class="
              px-2
              py-2
              bg-gray-50
              text-center text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            Citing
          </th>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(paper, index) in visiblePapers" :key="index">
            <td class="px-3 py-2 w-3 text-left text-gray-500">
              <button
                title="Remove from Graph"
                class="
                  font-extrabold
                  text-xs
                  rounded-full
                  h-5
                  w-5
                  bg-purple-500
                  text-white
                  justify-center
                "
                @click="removePaper(paper.id)"
              >
                X
              </button>
            </td>
            <td
              class="
                px-3
                py-2
                xl:whitespace-nowrap
                text-sm text-left
                leading-5
                overflow-hidden
                max-w-2xl
                text-gray-500
              "
            >
              <span :title="paper.title">
                {{ paper.title }}
              </span>
            </td>
            <td
              class="
                px-3
                py-2
                lg:whitespace-nowrap
                text-sm text-center
                leading-5
                text-gray-500
              "
            >
              <span v-if="paper.author.length > 0">
                <author :author="paper.author[0]" :ids="ids" />
              </span>
            </td>
            <td
              class="
                px-3
                py-2
                whitespace-nowrap
                text-sm text-center
                leading-5
                text-gray-500
              "
            >
              {{ paper.published_year }}
            </td>
            <td
              class="
                px-3
                py-2
                whitespace-nowrap
                text-sm text-center
                leading-5
                text-gray-500
              "
            >
              {{ paper.num_cited_by }}
            </td>
            <td
              class="
                px-3
                py-2
                whitespace-nowrap
                text-sm text-center
                leading-5
                text-gray-500
              "
            >
              {{ paper.num_citing }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td colspan="3" class="text-center">
              <button
                v-if="papers.length > numVisible"
                @click="togglePaperView()"
                class="underline hover:no-underline text-purple-700"
              >
                <span v-if="hidePapers"
                  ><svg
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
                      d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                    ></path>
                  </svg>
                  View All
                  <span class="font-bold">{{ ids.length }}</span></span
                ><span v-if="!hidePapers"
                  ><svg
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
                      d="M5 11l7-7 7 7M5 19l7-7 7 7"
                    ></path></svg
                  >View Less</span
                >
              </button>
            </td>
            <td colspan="2" class="text-xs text-right">
              <button
                @click="downloadBib()"
                title="Download Bibtex File"
                class="p-2"
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
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Paper, PaperID } from '@/types/inciteful'
import Vue, { PropType } from 'vue'
import api from '../utils/api'
import Author from './Author.vue'

export default Vue.extend({
  name: 'LitReviewHero',
  props: {
    ids: {} as PropType<PaperID[]>
  },
  components: { Author },
  data () {
    return {
      papers: undefined as Paper[] | undefined,
      numVisible: 5,
      hidePapers: true
    }
  },
  created () {
    this.setData(this.ids)
  },
  computed: {
    visiblePapers (): Paper[] {
      if (this.papers) {
        return this.papers.slice(
          0,
          this.hidePapers ? this.numVisible : this.papers.length
        )
      }
      return []
    }
  },
  watch: {
    ids: {
      handler (val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData (ids: PaperID[]): void {
      if (ids) {
        api.getPapers(ids, true).then(data => {
          this.papers = data
        })
      } else {
        this.papers = undefined
      }
    },
    removePaper (removeId: PaperID): void {
      const ids = this.papers!.filter(paper => paper.id !== removeId).map(
        paper => paper.id
      )
      this.$router.push({
        query: {
          ids: ids
        }
      })
    },
    downloadBib (): void {
      api.downloadBibFile(this.ids)
    },
    togglePaperView (): void {
      this.hidePapers = !this.hidePapers
    }
  }
})
</script>
