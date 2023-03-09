<template>
  <div class="shadow-box">
    <table class="base-table">
      <thead>
        <tr>
          <th></th>
          <th v-for="(column, index) in columns" :key="index">
            <button @click="sortBy(column.name, column.selector)" :class="{ 'font-bold': column.name == sortedBy }"
              class="uppercase">
              {{ column.displayName }}
              <ChevronDownIcon v-if="column.name == sortedBy && sortDescending" class="w-4 h-4 inline" />
              <ChevronUpIcon v-if="column.name == sortedBy && !sortDescending" class="w-4 h-4 inline" />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(paper, index) in sortedPapers" :key="index">
          <td class="max-w-xs pr-0">
            <favorite-paper-button :id="paper.id" />
          </td>
          <td class="overflow-hidden xl:whitespace-nowrap max-w-2xl">
            <paper-modal-button :text="paper.title" :id="paper.id" />
          </td>
          <td class="text-center">{{ paper.author[0].name }}</td>
          <td class="text-center">{{ paper.published_year }}</td>
          <td class="text-center">{{ paper.num_cited_by }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Paper, PaperID } from '@/types/incitefulTypes'
import api from '@/utils/incitefulApi'
import { storeToRefs } from 'pinia'
import { defineComponent, onMounted, ref, watch } from 'vue'
import FavoritePaperButton from './FavoritePaperButton.vue'
import PaperModalButton from './modals/PaperModalButton.vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/userStore'
import { IIndexable } from '../types/incitefulTypes'

export default defineComponent({
  components: {
    PaperModalButton,
    FavoritePaperButton,
    ChevronDownIcon,
    ChevronUpIcon
  },
  setup() {
    let user = useUserStore()
    let { userData } = storeToRefs(user)
    let favoritePapers = ref([] as Paper[])

    let currentPage = ref(1)
    let sortedBy = ref('')
    let sortDescending = ref(false)
    let selector = ref(undefined as ((p: Paper) => string) | undefined)

    let sortBy = (
      column: string,
      newSelector: ((p: Paper) => string) | undefined
    ) => {
      if (sortedBy.value == column) {
        sortDescending.value = !sortDescending.value
      } else {
        sortedBy.value = column
        sortDescending.value = false
      }

      if (newSelector) {
        selector.value = newSelector
      }
      currentPage.value = 1
    }

    let getPapers = (papers: PaperID[] | undefined) => {
      if (papers) {
        api.getPapers(papers, true).then(papers => {
          favoritePapers.value = papers
        })
      }
    }

    onMounted(() => getPapers(userData.value?.favoritePapers))

    watch(userData, curVal => {
      getPapers(curVal?.favoritePapers)
    })

    return {
      favoritePapers,
      currentPage,
      selector,
      sortBy,
      sortedBy,
      sortDescending,
      columns: [
        { name: 'title', displayName: 'Title' },
        {
          name: 'author',
          displayName: 'First author',
          selector: (p: Paper) => (p.author ? p.author[0].name : '')
        },
        { name: 'published_year', displayName: 'Year' },
        { name: 'num_cited_by', displayName: 'Citations' }
      ]
    }
  },
  computed: {
    sortedPapers(): Paper[] {
      const sorted = [...(this.favoritePapers ?? [])]

      let select = (p: Paper) => {
        if (this.selector) {
          return this.selector(p)
        } else {
          return (p as IIndexable)[this.sortedBy]
        }
      }

      if (
        this.sortedBy &&
        this.favoritePapers &&
        this.favoritePapers.length > 0
      ) {
        sorted.sort((a, b) => {
          if (select(b) > select(a)) {
            return this.sortDescending ? 1 : -1
          } else {
            return this.sortDescending ? -1 : 1
          }
        })
      }

      return sorted as Paper[]
    }
  }
})
</script>
