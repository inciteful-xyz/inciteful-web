<template>
  <span>
    <span v-for="(id, index) in externalIds" :key="index">
      <span v-if="id.DOI">
        <a
          class="underline hover:no-underline"
          target="_blank"
          :href="`https://doi.org/${id.DOI}`"
          >Publisher</a
        >
        |
        <a
          class="underline hover:no-underline"
          target="_blank"
          :href="`https://libkey.io/${id.DOI}?utm_source=inciteful`"
          >Full Text from LibKey</a
        >
        | </span
      ><span v-if="id.PMID">
        <a
          class="underline hover:no-underline"
          target="_blank"
          :href="`https://pubmed.ncbi.nlm.nih.gov/${id.PMID}`"
          >Pub Med</a
        >
        |
      </span>
      <span v-if="id.PMCID">
        <a
          class="underline hover:no-underline"
          target="_blank"
          :href="`https://www.ncbi.nlm.nih.gov/pmc/articles/${id.PMCID}/`"
          >Pub Med</a
        >
        |
      </span>
      <span v-if="id.ArxivID">
        <a
          class="underline hover:no-underline"
          target="_blank"
          :href="`https://arxiv.org/${id.ArxivID}/`"
          >arXiv</a
        >
        |
      </span>
      <span v-if="id.S2ID">
        <a
          class="underline hover:no-underline"
          :href="`https://api.semanticscholar.org/${id.S2ID}?utm_source=api`"
          target="_blank"
          >Semantic Scholar</a
        >
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import { PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'ExternalLinks',
  props: {
    externalIds: {} as PropType<PaperID[]>
  }
})
</script>
