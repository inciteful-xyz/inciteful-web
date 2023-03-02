<template>
  <div v-if="papers" class="shadow-box">
    <table class="base-table">
      <thead>
        <th v-if="userEnabled"></th>
        <th>
          Title
        </th>
        <th>
          First Author
        </th>
        <th>
          Year
        </th>
        <th>
          Cited By
        </th>
        <th></th>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(paper, index) in visiblePapers" :key="index">
          <td class="pt-2 pl-2" v-if="userEnabled">
            <FavoritePaperButton :id="paper.id" />
          </td>
          <td
            class="
                xl:whitespace-nowrap
                overflow-hidden
                max-w-2xl
              "
          >
            <paper-modal-button :id="paper.id" :text="paper.title" />
          </td>
          <td
            class="
                lg:whitespace-nowrap
                text-center
              "
          >
            <span v-if="paper.author.length > 0">
              <author :author="paper.author[0]" :ids="ids" />
            </span>
          </td>
          <td class="text-center">
            {{ paper.published_year }}
          </td>
          <td class="text-center">
            {{ paper.num_cited_by }}
          </td>
          <td class="pt-2 pr-2">
            <button title="Remove from Graph" @click="removePaper(paper.id)">
              <XCircleIcon class="h-5 w-5 text-violet-500" />
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
              class="underline hover:no-underline text-violet-700"
            >
              <span v-if="hidePapers"
                ><ChevronDoubleDownIcon class="w-4 h-4 inline" />
                View All
                <span class="font-bold">{{ ids ? ids.length : 0 }}</span></span
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
</template>

<script lang="ts">
import { Paper, PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'
import api from '../utils/incitefulApi'
import Author from './Author.vue'
import SaveDropDown from './SaveDropDown.vue'
import FavoritePaperButton from './FavoritePaperButton.vue'

import { useUserStore } from '@/stores/userStore'
import PaperModalButton from './Modals/PaperModalButton.vue'
import { XCircleIcon } from '@heroicons/vue/solid'

import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon
} from '@heroicons/vue/outline'

let user = useUserStore()

export default defineComponent({
  name: 'PaperList',
  props: {
    ids: {} as PropType<PaperID[]>
  },
  components: {
    Author,
    SaveDropDown,
    FavoritePaperButton,
    PaperModalButton,
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    XCircleIcon
  },
  data() {
    return {
      papers: undefined as Paper[] | undefined,
      numVisible: 5,
      hidePapers: true
    }
  },
  created() {
    if (this.ids) {
      this.setData(this.ids)
    }
  },
  computed: {
    userEnabled(): boolean {
      return user.enabled
    },
    visiblePapers(): Paper[] {
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
      handler(val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData(ids: PaperID[]): void {
      if (ids) {
        api.getPapers(ids, true).then(data => {
          this.papers = data

          // If any of the ids are different, update the url
          var origIds = ids.slice().sort()
          var newIds = this.papers
            .map(p => p.id)
            .slice()
            .sort()

          if (
            origIds.length !== newIds.length ||
            origIds.some((val, index) => val !== newIds[index])
          ) {
            this.$router.push({
              query: {
                ids: newIds
              }
            })
          }
        })
      } else {
        this.papers = undefined
      }
    },
    removePaper(removeId: PaperID): void {
      this.$emit('remove-paper', removeId)
    },
    togglePaperView(): void {
      this.hidePapers = !this.hidePapers
    }
  }
})
</script>
