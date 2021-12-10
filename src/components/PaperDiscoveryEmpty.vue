<template>
  <div>
    <div class="shadow bg-gray-800 lg:py-12 py-6 px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <div class="sm:text-center md:max-w-4xl md:mx-auto lg:text-left">
          <h2
            class="mt-1 text-4xl tracking-tight leading-10 font-extrabold text-gray-100 sm:leading-none lg:text-5xl xl:text-6xl"
          >
            A better way to discover
            <br class="hidden md:inline" />
            <span class="text-purple-400">relevant literature</span>
          </h2>
        </div>
        <div class="max-w-xl mx-auto px-4 md:max-w-screen-xl lg:px-6">
          <div class="lg:flex mt-3 sm:mt-5 ">
            <div class="flex-1 lg:pr-6 md:max-w-4xl md:mx-auto">
              <p
                class="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl"
              >
                Build a network of academic papers based on a paper of your
                choice and then we analyze the network to find the most relevant
                literature for you.
              </p>
              <div class="mt-5 sm:mx-auto lg:mx-0 text-gray-400">
                <p class="text-base font-medium">
                  Search for the title of a paper to get started.
                </p>
                <div>
                  <div class="flex pt-3">
                    <div class="flex-auto max-w-full text-base ">
                      <GraphSearch
                        :showImport="true"
                        v-on:selected="addLitReviewPapers"
                        v-on:searched="goToSearch"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-6 lg:py-12 bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div class="max-w-xl mx-auto px-4 lg:max-w-screen-xl lg:px-6">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="rounded-md bg-white p-6">
            <div
              class=" flex items-center float-left justify-center h-12 w-12 rounded-md mr-3 mb-1 bg-purple-500 text-2xl
                text-white"
            >
              1
            </div>
            <div class="mt-3">
              <h5 class="text-lg leading-6 font-medium text-gray-900">
                Start with a paper
              </h5>
              <p class="mt-5 text-base leading-6 text-gray-500">
                Search for a paper you are interested in or import a bib file
                with the references of a paper you are working on.
              </p>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 rounded-md bg-white p-6">
            <div
              class=" flex items-center justify-center float-left mr-3 mb-1 h-12 w-12 rounded-md bg-purple-500 text-2xl
                text-white"
            >
              2
            </div>
            <div class="mt-3">
              <h5 class="text-lg leading-6 font-medium text-gray-900">
                Add relevant papers
              </h5>
              <p class="mt-5 text-base leading-6 text-gray-500">
                As you find papers that are interesting, add them to the graph
                to to help us zero in on your topic, then do it again.
              </p>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 rounded-md bg-white p-6">
            <div
              class="flex items-center justify-center float-left mr-3 mb-1 h-12 w-12 rounded-md bg-purple-500 text-white  text-2xl"
            >
              3
            </div>
            <div class="mt-3">
              <h5 class="text-lg leading-6 font-medium text-gray-900">
                Download your findings
              </h5>
              <p class="mt-5 text-base leading-6 text-gray-500">
                Once you can't find any more relevant papers, import the results
                into your reference management software.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-6 xl:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div class="max-w-max-content lg:max-w-7xl mx-auto">
        <div class="relative z-10 mb-8 md:mb-2 md:px-6">
          <div class="text-base max-w-prose lg:max-w-none">
            <h1
              class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
            >
              Find the most relevant literature, faster
            </h1>
          </div>
        </div>
        <div class="relative">
          <svg
            class="hidden md:block absolute top-0 right-0 -mt-20 -mr-20"
            width="404"
            height="384"
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="95e8f2de-6d30-4b7e-8159-f791729db21b"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  class="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="404"
              height="384"
              fill="url(#95e8f2de-6d30-4b7e-8159-f791729db21b)"
            />
          </svg>
          <svg
            class="hidden md:block absolute bottom-0 left-0 -mb-20 -ml-20"
            width="404"
            height="384"
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="7a00fe67-0343-4a3c-8e81-c145097a3ce0"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  class="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="404"
              height="384"
              fill="url(#7a00fe67-0343-4a3c-8e81-c145097a3ce0)"
            />
          </svg>
          <div class="relative md:bg-white md:p-6">
            <div class="lg:grid lg:grid-cols-2 lg:gap-6 mb-8">
              <div
                class="prose prose-lg text-gray-500 mb-6 lg:max-w-none lg:mb-0"
              >
                <p>
                  The vast majority of academic search engines focus on
                  "importance" (as measured by number of citations) and keyword
                  matching to retrieve their results. They typically show you
                  stats about who the papers cite and who cites those papers.
                </p>
                <p>
                  But
                  <span class="font-bold"
                    >there is value and information in the underlying structure
                    that citations provide</span
                  >
                  and it is almost always ignored. Inciteful flips that on its
                  head by making citations the center of it's search process by:
                </p>
                <ol>
                  <li>
                    Building a citation network centered around the paper(s) of
                    your choice
                  </li>
                  <li>
                    Analyzing that network to surface the most interesting data
                  </li>
                </ol>
                <p>
                  <span class="font-bold"
                    >Each network, and the data within, is unique to your search
                  </span>
                  based on the papers you gave it so you can be sure to get the
                  most relevant results possible.
                </p>
              </div>
              <div class="prose prose-lg text-gray-500">
                <p>
                  With Inciteful's unique approach you are presented with not
                  only the most "important" papers in the graph, but
                  <span class="font-bold">also the most similar</span>. This
                  similarity measurement pulls from a class of algorithms called
                  "link prediction" algorithms.
                </p>
                <p>
                  Link prediction algorithms are used most commonly in social
                  networks to suggest people with whom you should be friends.
                  The same concept is applied here but for citations i.e. who we
                  think you might want to cite.
                </p>
                <p>
                  This approach tends to surface more recent literature and
                  helps you
                  <span class="font-bold"
                    >zero in on the state of the art more quickly</span
                  >
                  than if you were just looking for the top cited papers.
                </p>
                <p>
                  Inciteful also values flexibility. If at any point you want to
                  query the raw data yourself, there is a SQL interface into
                  each graph.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ is an alias to /src
import GraphSearch from './GraphSearch.vue'
import navigation from '../navigation'
import { PaperID } from '@/types/inciteful'

export default Vue.extend({
  name: 'PaperDiscoveryEmpty',
  components: {
    GraphSearch
  },
  methods: {
    addLitReviewPapers (ids: PaperID[]) {
      if (ids.length === 1) {
        this.$router.push({ path: navigation.getPaperUrl(ids[0]) })
      } else {
        this.$router.push({ name: 'LitReview', query: { ids } })
      }
    },
    goToSearch (query: string) {
      this.$router.push({ name: 'Search', query: { q: query } })
    }
  }
})
</script>
