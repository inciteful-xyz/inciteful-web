<template>
  <div>
    <div>
      <div class="flex justify-center">
        <div class="max-w-2xl justify-center text-xs sm:text-base">
          Use the Query Editor below to explore the graph centered around the
          above paper. You can also test out the examples below, explore the
          <a
            href="https://help.inciteful.xyz/power-users.html#database-schema"
            class="underline hover:no-underline"
            target="_blank"
            >schema</a
          >
          or click on the magnifying glass on any data table on the site to see
          the sql used to produce the results.
        </div>
      </div>
      <div class="p-2 sm:p-6 py-6 min-w-full justify-center flex">
        <span class="relative z-0 inline-flex shadow-sm rounded-md">
          <button
            type="button"
            class="
              relative
              inline-flex
              items-center
              px-4
              py-2
              rounded-l-md
              border border-gray-300
              bg-white
              text-sm
              leading-5
              font-medium
              text-gray-700
              hover:text-gray-500
              focus:z-10
              focus:outline-none
              focus:border-blue-300
              focus:ring-blue
              active:bg-gray-100
              active:text-gray-700
              transition
              ease-in-out
              duration-150
            "
            @click="runExample('basic')"
          >
            Basic Sort
          </button>
          <button
            type="button"
            class="
              -ml-px
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              bg-white
              text-sm
              leading-5
              font-medium
              text-gray-700
              hover:text-gray-500
              focus:z-10
              focus:outline-none
              focus:border-blue-300
              focus:ring-blue
              active:bg-gray-100
              active:text-gray-700
              transition
              ease-in-out
              duration-150
            "
            @click="runExample('most_journals')"
          >
            Journals with Most Papers
          </button>
          <button
            type="button"
            class="
              -ml-px
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              bg-white
              text-sm
              leading-5
              font-medium
              text-gray-700
              hover:text-gray-500
              focus:z-10
              focus:outline-none
              focus:border-blue-300
              focus:ring-blue
              active:bg-gray-100
              active:text-gray-700
              transition
              ease-in-out
              duration-150
            "
            @click="runExample('most_freq_auths')"
          >
            Most Frequent Authors
          </button>
          <button
            type="button"
            class="
              -ml-px
              relative
              inline-flex
              items-center
              px-4
              py-2
              rounded-r-md
              border border-gray-300
              bg-white
              text-sm
              leading-5
              font-medium
              text-gray-700
              hover:text-gray-500
              focus:z-10
              focus:outline-none
              focus:border-blue-300
              focus:ring-blue
              active:bg-gray-100
              active:text-gray-700
              transition
              ease-in-out
              duration-150
            "
            @click="runExample('most_cited_auths')"
          >
            Most Cited Authors
          </button>
        </span>
      </div>
    </div>
    <div>
      <div>
        <div
          id="query-editor"
          class="
            block
            w-auto
            max-h-80
            relative
            border-gray-200 border
            shadow-xl
            mb-7
            language-sql
            font-mono
            py-2
            px-2
            text-sm
            md:text-base
          "
        ></div>
        <div class="flow-root">
          <div class="flex">
            <div class="flex-1">
              <span class="inline-flex rounded-md shadow-sm mb-5 pr-8">
                <a
                  v-if="returnUrl"
                  type="button"
                  :href="returnUrl"
                  class="button-gray"
                >
                  &lt;&lt; Back
                </a>
              </span>
            </div>
            <div class="text-right flex-1">
              <span class="inline-flex rounded-md shadow-sm mb-5">
                <button
                  type="button"
                  @click="runCodeClick"
                  class="button-violet"
                >
                  Run Query
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SqlView :view="'table'" :sql="dashSql" :ids="ids" :filters="{}" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CodeJar } from 'codejar'
import Prism from 'prismjs'
import { withLineNumbers } from 'codejar/linenumbers'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism.css'

import SqlView from './SqlView.vue'
import { PaperID } from '../types/incitefulTypes'

export default defineComponent({
  name: 'QueryPanel',
  components: {
    SqlView
  },
  props: {
    ids: {} as PropType<PaperID[]>
  },
  data() {
    return {
      editor: undefined as CodeJar | undefined,
      dashSql: undefined as string | undefined,
      returnUrl: undefined as undefined | string
    }
  },
  mounted() {
    const node = document.querySelector('#query-editor') as HTMLElement
    this.editor = CodeJar(node, withLineNumbers(Prism.highlightElement))

    this.returnUrl = this.$route.query.returnUrl as string | undefined

    if (this.$route.query.sql !== undefined) {
      this.setCode(this.$route.query.sql as string)
      this.runCode()
    } else {
      this.runExample('basic')
    }
  },
  watch: {
    '$route.query.sql'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dashSql = newVal
        this.setCode(newVal)
      }
    }
  },
  methods: {
    getCode(): string {
      return this.editor !== undefined ? this.editor.toString() : ''
    },
    setCode(code: string): void {
      if (this.editor) this.editor.updateCode(code)
    },
    runCodeClick(): void {
      this.$router.push({
        query: { ...this.$route.query, sql: this.getCode() }
      })
    },
    runCode(): void {
      this.dashSql = this.getCode()
    },
    returnToPage(): void {
      if (this.returnUrl !== undefined) {
        window.location.href = this.returnUrl
      }
    },
    runExample(example: string) {
      switch (example) {
        case 'most_journals':
          this.setCode(
            `SELECT journal, COUNT(*) AS NumPapers
FROM papers
GROUP BY journal
ORDER BY COUNT(*) DESC`
          )
          break
        case 'most_cited_auths':
          this.setCode(`SELECT name, SUM(num_cited_by) AS totalCitations
FROM papers p
JOIN authors a ON a.paper_id = p.paper_id
GROUP BY name
ORDER BY SUM(num_cited_by) DESC`)
          break
        case 'most_freq_auths':
          this.setCode(`SELECT name, COUNT(*) AS numPapers
FROM papers p
JOIN authors a ON a.paper_id = p.paper_id
GROUP BY name
ORDER BY COUNT(*) DESC`)
          break
        default:
          this.setCode(
            `SELECT paper_id, authors, title, num_cited_by
FROM papers
ORDER BY num_cited_by DESC`
          )
          break
      }

      this.runCode()
    }
  }
})
</script>
