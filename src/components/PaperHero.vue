<template>
  <div v-if="paper" class="text-sm">
    <div id="paper-info">
      <h1
        class="text-lg font-bold text-gray-800 leading-tight lg:text-2xl pr-3"
      >
        {{ paper.title }}
      </h1>
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
          ><span v-if="paper.issue"> no {{ paper.issue }}.</span
          ><span v-if="paper.doi"> &nbsp;|&nbsp; DOI: {{ paper.doi }}</span>
        </div>
        <div class="flex-1 mt-2">
          <ul class="text-gray-500 font-semibold">
            <li
              v-for="(author, index) in paper.author"
              :key="index"
              class="inline-block mr-2"
            >
              <span v-if="index > 0">|&nbsp;</span>
              <span :title="author.affiliation">{{ author.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 sm:mt-6"
        v-if="
          paper.num_cited_by + paper.num_citing > 150 &&
            !receivedLoaded &&
            graphStats
        "
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: exclamation -->
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
              This graph has a large number of citations (incoming and
              outgoing). As a result it may take up to a minute for the graph to
              load. Please be patient.
            </p>
          </div>
        </div>
      </div>
      <div class="pt-4 mx-auto max-w-4xl">
        <AbstractView :abstract="abstract" />
      </div>
    </div>
    <div>
      <PaperHeroStats
        :num_cited_by="paper.num_cited_by"
        :num_citing="paper.num_citing"
        :published_year="paper.published_year"
        :id="paper.id"
        :doi="paper.doi"
        :graphStats="graphStats"
      />
    </div>

    <div class="pt-2 sm:pt-4 lg:flex">
      <div class="text-xs lg:flex-none">
        Links:
        <span v-if="paper.doi">
          <a
            class="underline hover:no-underline"
            target="_blank"
            :href="`https://doi.org/${paper.doi}`"
            >Publisher</a
          >
          |
          <a
            class="underline hover:no-underline"
            target="_blank"
            :href="`https://libkey.io/${paper.doi}?utm_source=inciteful`"
            >Full Text from LibKey</a
          >
          |
        </span>
        <span v-if="paper.magid">
          <a
            class="underline hover:no-underline"
            :href="`https://academic.microsoft.com/paper/${paper.magid}`"
            target="_blank"
            >Microsoft Academic Graph</a
          >
          |
          <a
            class="underline hover:no-underline"
            :href="
              `https://api.semanticscholar.org/MAG:${paper.magid}?utm_source=api`
            "
            target="_blank"
            >Semantic Scholar</a
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'
import PaperHeroStats from './PaperHeroStats'
import AbstractView from './AbstractView'
import bus from '../utils/bus'

export default {
  name: 'PaperHero',
  props: {
    paper: Object,
    graphStats: { type: Boolean, default: false }
  },
  components: {
    PaperHeroStats,
    AbstractView
  },
  data () {
    return {
      ss_paper: undefined,
      receivedLoaded: false,
      bus
    }
  },
  computed: {
    abstract () {
      if (!this.ss_paper || !this.ss_paper.abstract) return undefined

      return this.ss_paper.abstract
    }
  },
  mounted () {
    this.bus.$on('graph_loaded', () => {
      this.receivedLoaded = true
    })
  },
  created () {
    this.setData(this.paper)
  },
  watch: {
    paper: {
      handler (val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData (paper) {
      if (paper) {
        if (paper.magid) {
          api.semanticScholarMag(this.paper.magid).then(data => {
            this.ss_paper = data
          })
        } else {
          this.ss_paper = undefined
        }
      }
    }
  }
}
</script>
