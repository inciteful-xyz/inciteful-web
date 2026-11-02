<template>
  <div class="animate-fade-up">
    <!-- Hero Section -->
    <Section class="pt-6 pb-4 md:pt-8 md:pb-6 bg-theme-light">
      <Container md>
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
            <span class="text-theme-violet font-normal">Inciteful for Zotero</span>
          </h1>
          <TextLG class="text-theme-charcoal">
            A free, open-source Zotero plugin that connects the papers in your library to Inciteful's citation network.
          </TextLG>
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              class="inline-flex items-center px-6 py-3 font-semibold rounded-xl text-white bg-theme-violet hover:bg-theme-violet-2 transition-colors"
              :href="LATEST_XPI"
            >
              Download for Zotero 8, 9 and 10
            </a>
            <a class="text-theme-violet hover:underline" :href="REPO_URL" target="_blank" rel="noopener">
              Source code on GitHub
            </a>
          </div>
        </div>
      </Container>
    </Section>

    <Section class="bg-white">
      <Container sm>
        <div class="text-theme-charcoal text-lg">
          <h2 class="font-battambang font-light text-2xl text-black mb-4">
            What it does
          </h2>

          <p class="mb-4 leading-relaxed">
            The plugin adds Inciteful to Zotero's right-click menus. Each command opens the result on this site in your web browser.
          </p>

          <h3 class="font-battambang font-light text-xl text-black mt-6 mb-2">
            Graph Search
          </h3>

          <p class="mb-4 leading-relaxed">
            Select one or more items, right-click, and choose Inciteful.xyz Tools → Graph Search to open the citation network built from those papers.
          </p>

          <h3 class="font-battambang font-light text-xl text-black mt-6 mb-2">
            Search a collection
          </h3>

          <p class="mb-4 leading-relaxed">
            Right-click a collection and choose Graph Search using Inciteful.xyz to build the network from the papers in it. In Zotero 10 you can select several collections and search across all of them.
          </p>

          <h3 class="font-battambang font-light text-xl text-black mt-6 mb-2">
            Connect Papers
          </h3>

          <p class="mb-4 leading-relaxed">
            Select two items, right-click, and choose Inciteful.xyz Tools → Connect Papers to see how they are linked through citations.
          </p>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            Install
          </h2>

          <ol class="list-decimal pl-6 space-y-2 mb-4">
            <li>
              <a class="text-theme-violet hover:underline" :href="LATEST_XPI">Download the plugin file (.xpi)</a>.
              In Firefox, right-click the link and choose "Save Link As…"; otherwise Firefox tries to install it as a browser add-on.
            </li>
            <li>In Zotero, open Tools → Plugins.</li>
            <li>Click the gear icon, choose "Install Plugin From File…", and select the downloaded file.</li>
          </ol>

          <p class="mb-4 leading-relaxed">
            Zotero keeps the plugin up to date after that.
          </p>

          <h3 class="font-battambang font-light text-xl text-black mt-6 mb-2">
            Older Zotero versions
          </h3>

          <p class="mb-4 leading-relaxed">
            New versions of the plugin need Zotero 8 or later. The last releases for older Zotero versions still work but get no new features:
          </p>

          <ul class="list-disc pl-6 space-y-1 mb-4">
            <li>
              Zotero 7: <a class="text-theme-violet hover:underline" :href="ZOTERO_7_XPI">version 0.1.1</a>
            </li>
            <li>
              Zotero 6: <a class="text-theme-violet hover:underline" :href="ZOTERO_6_XPI">version 0.0.9</a>.
              In Zotero 6, install it from Tools → Add-ons → gear icon → "Install Add-on From File…".
            </li>
          </ul>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            Privacy
          </h2>

          <p class="mb-4 leading-relaxed">
            The plugin has no account or sign-in, and nothing is sent until you choose one of its menu items. Then it puts the selected items' DOIs (or an item's URL, when it has no DOI) in the link it opens in your browser. Nothing else from your library is sent: no titles, notes, attachments, tags or collection names.
          </p>

          <p class="mb-4 leading-relaxed">
            Pages the plugin opens on this site are covered by our
            <a class="text-theme-violet hover:underline" href="https://incitefulmed.com/privacy/" target="_blank" rel="noopener">privacy policy</a>.
          </p>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            Source code and support
          </h2>

          <p class="mb-4 leading-relaxed">
            The plugin is open source under the AGPL-3.0-or-later licence on
            <a class="text-theme-violet hover:underline" :href="REPO_URL" target="_blank" rel="noopener">GitHub</a>.
            Report problems there or email
            <a class="text-theme-violet hover:underline" href="mailto:hello@incitefulmed.com">hello@incitefulmed.com</a>.
          </p>
        </div>
      </Container>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { Section, Container } from '@/components/ui/layouts'
import { TextLG } from '@/components/ui/typography'

const REPO_URL = 'https://github.com/inciteful-xyz/inciteful-zotero-plugin'
const LATEST_XPI = 'https://github.com/inciteful-xyz/inciteful-zotero-plugin/releases/latest/download/inciteful-zotero-plugin.xpi'
const ZOTERO_7_XPI = 'https://github.com/inciteful-xyz/inciteful-zotero-plugin/releases/download/v0.1.1/inciteful-zotero-plugin.xpi'
const ZOTERO_6_XPI = 'https://github.com/inciteful-xyz/inciteful-zotero-plugin/releases/download/0.0.9/inciteful-zotero-plugin.xpi'
</script>
