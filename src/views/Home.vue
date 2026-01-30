<template>
  <div class="home animate-fade-up">
    <!-- Hero Section -->
    <Section class="pt-6 md:pt-8 bg-theme-light">
      <Container md>
        <!-- Centered Content -->
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <!-- Header -->
          <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
            <span class="text-theme-violet font-normal ">Accelerate Your Research</span>
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

        <!-- Bottom Feature Cards -->
        <div class="grid relative z-10 grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-4 sm:gap-y-8 mt-12 sm:mt-20">
          <FeatureCard
            v-for="feature in featureCards"
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :text="feature.text"
          />
        </div>
      </Container>
    </Section>

    <!-- About Section -->
    <Section class="bg-white">
      <Container md>
        <div class="text-center mb-10">
          <TitleMD>Find the most relevant literature, faster</TitleMD>
        </div>
        <div class="lg:grid lg:grid-cols-2 lg:gap-10">
          <div class="text-lg leading-relaxed text-theme-charcoal space-y-4 mb-6 lg:mb-0">
            <p>
              The goal of Inciteful is to give the world free tools to help
              accelerate academic research. Whether you're getting up to
              speed on a new topic, finding the latest literature, or
              figuring out how two ideas are connected, we can help.
            </p>
            <p>
              Unlike a traditional search engine, citations are the
              cornerstone of all our tools. Building these tools for all
              academic literature has only recently been possible with the
              rise of open scholarly bibliographic data and the amazing work
              being done by <router-link class="text-theme-violet hover:underline" to="/data">these groups</router-link>.
            </p>
          </div>
          <div class="text-lg leading-relaxed text-theme-charcoal space-y-4">
            <p>
              Our <router-link class="text-theme-violet hover:underline" to="/p">Paper Discovery</router-link> tool builds a network of
              papers from citations, uses network analysis algorithms to
              analyze the network, and gives you the information you need to
              quickly get up to speed on any topic.
            </p>
            <p>
              Built off the backs of free and open
              <router-link class="text-theme-violet hover:underline" to="/data">data</router-link>, we commit to paying it forward by
              keeping our own tools free for everyone. To learn more, visit our
              <router-link class="text-theme-violet hover:underline" to="/about">about page</router-link>.
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
          </div>
          <div class="text-center p-8 bg-white rounded-2xl border border-theme-pink shadow-sm">
            <div class="text-4xl md:text-5xl font-battambang font-light text-theme-violet mb-2">2B+</div>
            <div class="text-lg text-theme-charcoal">Citations indexed</div>
          </div>
          <div class="text-center p-8 bg-white rounded-2xl border border-theme-pink shadow-sm">
            <div class="text-4xl md:text-5xl font-battambang font-light text-theme-violet mb-2">100%</div>
            <div class="text-lg text-theme-charcoal">Free to use</div>
          </div>
        </div>
      </Container>
    </Section>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import FeatureCheckmarks from '@/components/home/FeatureCheckmarks.vue'
import FeatureCard from '@/components/home/FeatureCard.vue'
import { Section, Container } from '@/components/ui/layouts'
import { TitleMD, TextLG } from '@/components/ui/typography'
import navigation from '../navigation'
import { PaperID } from '@/types/incitefulTypes'
import {
  DocumentChartBarIcon,
  CubeTransparentIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'
import { setPageMeta, setOrganizationSchema } from '@/utils/seo'

const router = useRouter()

const heroFeatures = [
  'Find similar papers',
  'Discover key authors',
  'Explore citation networks',
  'Export to Zotero'
]

const featureCards = [
  {
    icon: GlobeAltIcon,
    title: 'Over 240 million papers',
    text: 'Our database covers the majority of academic papers in peer reviewed journals as well as books. Hundreds of thousands more are added every month.'
  },
  {
    icon: CubeTransparentIcon,
    title: 'Almost 2 billion citations',
    text: 'We collect citation information from a variety of data sources to ensure as much coverage as possible since citations are the cornerstone of our tools.'
  },
  {
    icon: DocumentChartBarIcon,
    title: 'Built to be flexible',
    text: 'Whether you want to use the pre-defined analyses or you are a power user wanting to explore the data with SQL, Inciteful gives you the tools you need.'
  }
]

onMounted(() => {
  setPageMeta({
    title: 'Using Citations to Explore Academic Literature',
    description: 'Committed to open access, Inciteful uses the power of graph analysis to help you explore and find the most relevant academic literature.',
    canonical: '/'
  })
  setOrganizationSchema()
})

function addLitReviewPapers(ids: PaperID[]) {
  if (ids.length === 1) {
    router.push({ path: navigation.getPaperUrl(ids[0]) })
  } else {
    router.push({ name: 'LitReview', query: { ids } })
  }
}

function goToSearch(query: string) {
  router.push({ name: 'Search', query: { q: query } })
}
</script>
