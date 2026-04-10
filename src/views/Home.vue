<template>
  <div class="home animate-fade-up">
    <!-- Hero Section -->
    <Section class="pt-6 md:pt-8 md:mt-12 bg-theme-light">
      <Container md>
        <!-- Centered Content -->
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <!-- Header -->
          <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
            <span class="text-theme-violet font-normal">Accelerate Your Research</span>
          </h1>

          <!-- Subtitle -->
          <TextLG class="mb-10 max-w-3xl mt-2 text-theme-charcoal">
            Build a network of academic papers and we'll analyze the citations to help you
            <span class="text-theme-violet font-semibold">discover the most relevant literature</span>.
          </TextLG>

          <!-- Search Bar -->
          <SearchBar
            :showImport="true"
            @selected="addLitReviewPapers"
            @searched="goToSearch"
          />

          <!-- Feature List with Checkmarks -->
          <FeatureCheckmarks :features="heroFeatures" />
        </div>

      </Container>
    </Section>

    <!-- How It Works Section -->
    <Section class="bg-white">
      <Container md>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-theme-lavender rounded-2xl border border-theme-pink">
            <div class="w-12 h-12 rounded-full bg-theme-violet flex items-center justify-center text-white text-xl font-bold mb-4">
              1
            </div>
            <h2 class="text-lg font-semibold text-theme-charcoal mb-2">Start with a paper</h2>
            <p class="text-theme-charcoal">
              Search for a paper you are interested in or import a BibTeX file
              with the references of a paper you are working on.
            </p>
          </div>
          <div class="p-6 bg-theme-lavender rounded-2xl border border-theme-pink">
            <div class="w-12 h-12 rounded-full bg-theme-violet flex items-center justify-center text-white text-xl font-bold mb-4">
              2
            </div>
            <h2 class="text-lg font-semibold text-theme-charcoal mb-2">Add relevant papers</h2>
            <p class="text-theme-charcoal">
              As you find papers that are interesting, add them to the graph
              to help us zero in on your topic, then do it again.
            </p>
          </div>
          <div class="p-6 bg-theme-lavender rounded-2xl border border-theme-pink">
            <div class="w-12 h-12 rounded-full bg-theme-violet flex items-center justify-center text-white text-xl font-bold mb-4">
              3
            </div>
            <h2 class="text-lg font-semibold text-theme-charcoal mb-2">Download your findings</h2>
            <p class="text-theme-charcoal">
              Once you can't find any more relevant papers, export the results
              to Zotero, Mendeley, or your reference manager of choice.
            </p>
          </div>
        </div>
      </Container>
    </Section>

    <!-- About Section -->
    <Section class="bg-theme-light">
      <Container md>
        <div class="text-center mb-10">
          <TitleMD>A smarter approach to literature discovery</TitleMD>
        </div>
        <div class="lg:grid lg:grid-cols-2 lg:gap-10">
          <div class="text-lg leading-relaxed text-theme-charcoal space-y-4 mb-6 lg:mb-0">
            <p>
              Most academic search engines focus on "importance" (as measured by
              number of citations) and keyword matching. But <span class="font-semibold">there is value
              in the underlying structure that citations provide</span> — and it is
              almost always ignored.
            </p>
            <p>
              Inciteful flips that on its head by making citations the center of
              the search process: we build a citation network centered around your
              paper(s), then analyze that network to surface the most interesting data.
            </p>
          </div>
          <div class="text-lg leading-relaxed text-theme-charcoal space-y-4">
            <p>
              With our unique approach, you find not only the most "important" papers
              in the graph, but <span class="font-semibold">also the most similar</span> using
              link prediction algorithms — the same algorithms used in social networks
              to suggest friends.
            </p>
            <p>
              This approach tends to surface more recent literature and helps you
              <span class="font-semibold">zero in on the state of the art more quickly</span> than
              just looking for the top cited papers. Built on
              <router-link class="text-theme-violet hover:underline" to="/data">open data</router-link>,
              we keep our tools free for everyone.
            </p>
          </div>
        </div>
      </Container>
    </Section>

    <!-- Stats Section -->
    <Section class="bg-theme-lavender">
      <Container md>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-8 bg-white rounded-2xl border border-theme-pink shadow-sm">
            <div class="text-4xl md:text-5xl font-battambang font-light text-theme-violet mb-2">240M+</div>
            <div class="text-lg text-theme-charcoal">Academic papers</div>
            <p class="text-theme-charcoal leading-snug py-3">Our database covers the majority of academic papers in peer reviewed journals as well as books. Hundreds of thousands more are added every month.</p>
          </div>
          <div class="text-center p-8 bg-white rounded-2xl border border-theme-pink shadow-sm">
            <div class="text-4xl md:text-5xl font-battambang font-light text-theme-violet mb-2">2B+</div>
            <div class="text-lg text-theme-charcoal">Citations indexed</div>
            <p class="text-theme-charcoal leading-snug py-3">We collect citation information from a variety of data sources to ensure as much coverage as possible since citations are the cornerstone of our tools.</p>
          </div>
          <div class="text-center p-8 bg-white rounded-2xl border border-theme-pink shadow-sm">
            <div class="text-4xl md:text-5xl font-battambang font-light text-theme-violet mb-2">100%</div>
            <div class="text-lg text-theme-charcoal">Free to use</div>
            <p class="text-theme-charcoal leading-snug py-3">Our core tools are free to use and always will be. We believe in open access and that knowledge should be free for everyone.</p>
          </div>
        </div>
      </Container>
    </Section>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import posthog from 'posthog-js'
import SearchBar from '@/components/ui/SearchBar.vue'
import FeatureCheckmarks from '@/components/home/FeatureCheckmarks.vue'
import { Section, Container } from '@/components/ui/layouts'
import { TitleMD, TextLG } from '@/components/ui/typography'
import navigation from '../navigation'
import { PaperID } from '@/types/incitefulTypes'
import { setPageMeta, setOrganizationSchema } from '@/utils/seo'

const router = useRouter()

const heroFeatures = [
  'Find similar papers',
  'Discover key authors',
  'Explore citation networks',
  'Export to Zotero'
]
onMounted(() => {
  setPageMeta({
    title: 'Paper Discovery - Find Relevant Academic Literature Using Citations',
    description: 'Build citation networks to discover the most relevant academic papers. Free tool using graph analysis to help researchers explore literature faster.',
    canonical: '/'
  })
  setOrganizationSchema()
})

function addLitReviewPapers(ids: PaperID[]) {
  // posthog.capture('home_paper_selected', { paper_count: ids.length })
  if (ids.length === 1) {
    router.push({ path: navigation.getPaperUrl(ids[0]) })
  } else {
    router.push({ name: 'LitReview', query: { ids } })
  }
}

function goToSearch(query: string) {
  // posthog.capture('paper_search_submitted', { query })
  router.push({ name: 'Search', query: { q: query } })
}
</script>
