<template>
  <single-column>
    <div class="pb-3">
      <h1 class="text-xl sm:text-3xl">Data Sources</h1>
      <div>
        Without all of the work that has gone into coordinating, parsing, and
        categorizing all of the academic literature undertaken by a variety of
        different projects, Inciteful, and other sites like it, wouldn't exists.
        We have pulled both data and/or inspiration from all of the projects
        listed below:
      </div>
      <div class="flex justify-center">
        <div class="max-w-4xl pt-8">
          <div>
            <h2 class="text-lg sm:text-2xl whitespace-nowrap pb-3">
              <a
                class="underline hover:no-underline"
                href="https://www.microsoft.com/en-us/research/project/microsoft-academic-graph/"
                >Microsoft Academic Graph</a
              >
            </h2>
            The Microsoft Academic Graph is a heterogeneous graph containing
            scientific publication records, citation relationships between those
            publications, as well as authors, institutions, journals,
            conferences, and fields of study.
          </div>
          <div class="pt-6 mt-6 border-gray-300 border-t">
            <h2 class="text-lg sm:text-2xl whitespace-nowrap pb-3">
              <a href="https://www.semanticscholar.org/"
                ><img
                  class="w-96"
                  src="../assets/images/semantic-scholar-logo.png"
              /></a>
            </h2>
            Semantic Scholar is a project developed at the Allen Institute for
            Artificial Intelligence. Publicly released in November 2015, it is
            designed to be an AI-backed search engine for academic publications.
            The project uses a combination of machine learning, natural language
            processing, and machine vision to add a layer of semantic analysis
            to the traditional methods of citation analysis, and to extract
            relevant figures, entities, and venues from papers. In comparison to
            Google Scholar and PubMed, Semantic Scholar is designed to highlight
            the most important and influential papers, and to identify the
            connections between them.
            <span
              class="text-xs"
              href="https://en.wikipedia.org/wiki/Semantic_Scholar"
              >(Wikipedia)</span
            >
          </div>
          <div class="pt-6 mt-6 border-gray-300 border-t">
            <h2 class="text-lg sm:text-2xl whitespace-nowrap pb-3">
              <a href="https://www.unpaywall.org/"
                ><img class="w-96" src="../assets/images/unpaywall-logo.jpg" />
              </a>
            </h2>
            We harvest Open Access content from over 50,000 publishers and
            repositories, and make it easy to find, track, and use.
          </div>
          <div class="pt-6 mt-6 border-gray-300 border-t">
            <h2 class="text-lg sm:text-2xl whitespace-nowrap pb-3">
              <a href="https://www.crossref.org/"
                ><img class="w-96" src="../assets/images/crossref-logo.jpg" />
              </a>
            </h2>
            Crossref makes research outputs easy to find, cite, link, assess,
            and reuse. We’re a not-for-profit membership organization that
            exists to make scholarly communications better.
          </div>
          <div class="pt-6 mt-6 border-gray-300 border-t">
            <h2 class="text-lg sm:text-2xl whitespace-nowrap pb-3">
              <a href="https://www.opencitations.net/"
                ><img
                  class="w-32"
                  src="../assets/images/opencitations-logo.png"
                />
              </a>
            </h2>
            OpenCitations is an independent infrastructure organization for open
            scholarship dedicated to the publication of open bibliographic and
            citation data by the use of Semantic Web (Linked Data) technologies.
            It is also engaged in advocacy for open citations, particularly in
            its role as a key founding member of the Initiative for Open
            Citations (I4OC).
          </div>
        </div>
      </div>
    </div>
  </single-column>
</template>

<script lang="ts">
import Vue from 'vue'
import SingleColumn from '../components/layout/SingleColumn.vue'

export default Vue.extend({
  name: 'DataSources',
  components: {
    SingleColumn
  }
})
</script>

SingleColumn
