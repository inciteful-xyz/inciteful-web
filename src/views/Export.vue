<template>
  <single-column>
    <!-- Drop down to select the appropriate tool -->
    <div class="flex items-center gap-x-6 text-white bg-violet-600 py-2.5 px-6 sm:px-3.5 rounded-lg">
      <div class="flex-initial justify-left items-center">
        <label for="tool" class="mr-2">Export to</label>
        <select id="tool" v-model="tool" class="border border-gray-300 rounded-md w-32 text-gray-600">
          <option value="Zotero">Zotero</option>
          <option value="Mendeley">Mendeley</option>
        </select>
      </div>
      <div class="flex-grow">
        <div v-if="tool == 'Zotero'">
          <!-- Describe how to install the Zotero Web Connector -->
          <p>
            You first install the
            <a class="underline" href="https://www.zotero.org/download/connectors" target="_blank"
              rel="noopener noreferrer">Zotero Connector</a>. Then you can import the papers below using the extension.
          </p>
        </div>
        <div v-else-if="tool == 'Mendeley'">
          <!-- Describe how to install the Mendeley Web Importer -->
          <p>
            You must install the
            <a href="https://www.mendeley.com/reference-management/web-importer" target="_blank" class="underline"
              rel="noopener noreferrer">Mendeley Web Importer</a>. Then you can import the papers below using the
            extension.
          </p>
        </div>
      </div>
    </div>
    <div v-if="ids">
      <h2 class="text-xl md:text-3xl leading-9 font-extrabold text-gray-600 mt-10 mb-5">
        Papers to Export
      </h2>
      <PaperList :ids="ids" :hide-papers-default="false" :show-footer="false" />
    </div>
  </single-column>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SingleColumn from '../components/layout/SingleColumn.vue'
import { PaperID, ReferenceManagers } from '../types/incitefulTypes';
import PaperList from '@/components/PaperList.vue';

export default defineComponent({
  name: 'ToolExport',
  components: {
    SingleColumn,
    PaperList
  },
  data() {
    return {
      ids: undefined as undefined | PaperID[],
      tool: 'Zotero' as ReferenceManagers,
    }
  },
  created() {
    if (this.$route.query.tool !== undefined) {
      if (this.$route.query.tool === 'Mendeley')
        this.tool = ReferenceManagers.Mendeley
      else
        this.tool = ReferenceManagers.Zotero
    }

    this.ids = this.$route.query.ids as PaperID[]

    this.$watch(() => this.tool, this.toolChanged)

  },
  methods: {
    toolChanged(val: ReferenceManagers): void {
      this.tool = val
      this.$router.push({ query: { tool: val, ids: this.ids } })
    },
  }
})
</script>
 