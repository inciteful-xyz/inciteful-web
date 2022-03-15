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
          <ExclamationIcon class="h-5 w-5 text-yellow-400" />
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
      class="shadow border-b border-gray-200 sm:rounded-lg mb-3"
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
            v-if="userEnabled"
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
              text-left text-xs
              leading-4
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          ></th>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(paper, index) in visiblePapers" :key="index">
            <td class="pt-2 pl-2" v-if="userEnabled">
              <FavoritePaperButton :id="paper.id" />
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
              <paper-modal-button :id="paper.id" :text="paper.title" />
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
            <td class="pt-2 pr-2">
              <button title="Remove from Graph" @click="removePaper(paper.id)">
                <XCircleIcon class="h-5 w-5 text-purple-500" />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td v-if="userEnabled"></td>
            <td colspan="2" class="text-center">
              <button
                v-if="papers.length > numVisible"
                @click="togglePaperView()"
                class="underline hover:no-underline text-purple-700"
              >
                <span v-if="hidePapers"
                  ><ChevronDoubleDownIcon class="w-4 h-4 inline" />
                  View All
                  <span class="font-bold">{{ ids.length }}</span></span
                ><span v-if="!hidePapers"
                  ><ChevronDoubleUpIcon class="w-4 h-4 inline" />View Less</span
                >
              </button>
            </td>
            <td colspan="3" class="text-xs text-right whitespace-nowrap">
              <div>
                <SaveDropDown :ids="papers.map(p => p.id)" />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Paper, PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
import api from '../utils/api'
import Author from './Author.vue'
import SaveDropDown from './SaveDropDown.vue'
import { XCircleIcon } from '@heroicons/vue/solid'
import FavoritePaperButton from './FavoritePaperButton.vue'

import {
  ExclamationIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon
} from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/user'
import PaperModalButton from './PaperModalButton.vue'

let user = useUserStore()

export default defineComponent({
  name: 'LitReviewHero',
  props: {
    ids: {} as PropType<PaperID[]>
  },
  components: {
    Author,
    SaveDropDown,
    ExclamationIcon,
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    XCircleIcon,
    FavoritePaperButton,
    PaperModalButton
  },
  data () {
    return {
      papers: undefined as Paper[] | undefined,
      numVisible: 5,
      hidePapers: true
    }
  },
  created () {
    if (this.ids) {
      this.setData(this.ids)
    }
  },
  computed: {
    userEnabled (): boolean {
      return user.enabled
    },
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
    togglePaperView (): void {
      this.hidePapers = !this.hidePapers
    }
  }
})
</script>
