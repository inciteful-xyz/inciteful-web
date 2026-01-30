<template>
  <div class="animate-fade-up">
    <!-- Hero Section -->
    <Section class="pt-6 pb-4 md:pt-8 md:pb-6 bg-theme-light">
      <Container md>
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
            <span class="text-theme-violet font-normal">Data Sources</span>
          </h1>
          <TextLG class="text-theme-charcoal">
            Without all of the work that has gone into coordinating, parsing,
            and categorizing academic literature by these projects, Inciteful
            wouldn't exist. We are grateful for their contributions to open scholarship.
          </TextLG>
        </div>
      </Container>
    </Section>

    <!-- Data Sources -->
    <Section class="bg-white">
      <Container md>
        <div class="space-y-8">
          <!-- OpenAlex -->
          <div class="p-6 sm:p-8 border border-theme-pink rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <a href="https://openalex.org/" target="_blank" class="block mb-4">
              <img class="h-12 sm:h-16" src="../assets/images/openalex-logo.png" alt="OpenAlex" />
            </a>
            <p class="text-theme-charcoal leading-relaxed">
              OpenAlex is a free and open catalog of the world's scholarly papers,
              researchers, journals, and institutions — along with all the ways
              they're connected to one another. Using OpenAlex, you can build your
              own scholarly search engine, recommender service, or knowledge
              graph. Because we think all research should be free and open,
              OpenAlex is free and open itself, and we're built on a fully Open Source codebase.
            </p>
            <a class="text-sm text-theme-violet hover:underline mt-2 inline-block" href="https://openalex.org/about" target="_blank">
              Learn more about OpenAlex →
            </a>
          </div>

          <!-- Semantic Scholar -->
          <div class="p-6 sm:p-8 border border-theme-pink rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <a href="https://www.semanticscholar.org/" target="_blank" class="block mb-4">
              <img class="h-12 sm:h-16" src="../assets/images/semantic-scholar-logo.png" alt="Semantic Scholar" />
            </a>
            <p class="text-theme-charcoal leading-relaxed">
              Semantic Scholar is a project developed at the Allen Institute for
              Artificial Intelligence. It is designed to be an AI-backed search engine
              for academic publications. The project uses a combination of machine learning,
              natural language processing, and machine vision to add a layer of semantic
              analysis to traditional citation analysis, and to extract relevant figures,
              entities, and venues from papers.
            </p>
            <a class="text-sm text-theme-violet hover:underline mt-2 inline-block" href="https://www.semanticscholar.org/about" target="_blank">
              Learn more about Semantic Scholar →
            </a>
          </div>

          <!-- Crossref -->
          <div class="p-6 sm:p-8 border border-theme-pink rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <a href="https://www.crossref.org/" target="_blank" class="block mb-4">
              <img class="h-12 sm:h-16" src="../assets/images/crossref-logo.jpg" alt="Crossref" />
            </a>
            <p class="text-theme-charcoal leading-relaxed">
              Crossref makes research outputs easy to find, cite, link, assess,
              and reuse. They are a not-for-profit membership organization that
              exists to make scholarly communications better. Crossref is the official
              DOI registration agency for scholarly and professional publications.
            </p>
            <a class="text-sm text-theme-violet hover:underline mt-2 inline-block" href="https://www.crossref.org/about/" target="_blank">
              Learn more about Crossref →
            </a>
          </div>

          <!-- OpenCitations -->
          <div class="p-6 sm:p-8 border border-theme-pink rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <a href="https://www.opencitations.net/" target="_blank" class="block mb-4">
              <img class="h-12 sm:h-16" src="../assets/images/opencitations-logo.png" alt="OpenCitations" />
            </a>
            <p class="text-theme-charcoal leading-relaxed">
              OpenCitations is an independent infrastructure organization for open
              scholarship dedicated to the publication of open bibliographic and
              citation data using Semantic Web (Linked Data) technologies.
              They are a key founding member of the Initiative for Open Citations (I4OC),
              advocating for freely accessible citation data.
            </p>
            <a class="text-sm text-theme-violet hover:underline mt-2 inline-block" href="https://opencitations.net/about" target="_blank">
              Learn more about OpenCitations →
            </a>
          </div>
        </div>
      </Container>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { Section, Container } from '@/components/ui/layouts'
import { TextLG } from '@/components/ui/typography'
</script>
