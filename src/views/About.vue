<template>
  <div class="animate-fade-up">
    <!-- Hero Section -->
    <Section class="pt-6 pb-4 md:pt-8 md:pb-6 bg-theme-light">
      <Container md>
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="mb-2 font-battambang font-light leading-tight text-black text-3xl sm:text-4xl md:text-5xl">
            <span class="text-theme-violet font-normal">About Inciteful</span>
          </h1>
          <TextLG class="text-theme-charcoal">
            Building tools to help researchers discover relevant literature faster.
          </TextLG>
        </div>
      </Container>
    </Section>

    <!-- Story Section -->
    <Section class="bg-white">
      <Container sm>
        <div class="prose prose-lg max-w-none text-theme-charcoal">
          <p>
            The seed of the idea for Inciteful came about as a result of a frustrating
            experience after helping my wife (the academic of the family) with some
            research. I was interested in a topic that was tangentially related to
            what she was working on but she wasn't familiar with that specific
            literature.
          </p>

          <p>
            As a result I went down a rabbit hole of going to Google Scholar to look
            for papers, scanning papers for references, looking at who cited those
            papers, and then returning to Google Scholar to repeat the process. All
            while keeping the results of my search in a notepad, noting connections
            between different papers to better understand how they are all related.
          </p>

          <p>
            After an embarrassingly long time, I realized I was just drawing a network
            graph. Probably an experience that most academics can relate to.
          </p>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            From Idea to Reality
          </h2>

          <p>
            My background is in Computer Science and I'm a developer by trade so my
            mind quickly jumped to how this whole process could be automated. I also
            have a bit of ADD so the interest in my original research question was
            quickly and easily overtaken by this new project.
          </p>

          <p>
            After spending the first year of life as a hacked together Python notebook
            using the APIs from
            <a class="text-theme-violet hover:underline" href="https://opencitations.net/" target="_blank">Open Citations</a>
            and
            <a class="text-theme-violet hover:underline" href="https://crossref.org" target="_blank">Crossref</a>,
            I decided to try and scale it up to something that others could use.
          </p>

          <p>
            The biggest problem was the real time creation of the graph. My original
            solution took over 15 minutes to build the graph for a paper with only a
            few citations and 40-50 references. It was clearly too slow.
          </p>

          <p>
            After a number of fits and starts, where I ended up learning a new
            programming language
            (<a class="text-theme-violet hover:underline" href="https://www.rust-lang.org/" target="_blank">Rust</a>),
            testing out a number of databases, changing the source of my data, and
            re-architecting the code a few times, I finally found a solution that I'm
            happy with and I hope you are too.
          </p>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            Committed to Open Access
          </h2>

          <p>
            As this is built upon the back of data that I received for free, it feels
            like bad karma to charge for the service. That being said, it's pretty
            expensive to keep the site up and running as the backend servers need to
            be pretty powerful to give a good experience to the end users.
          </p>

          <p>
            In the future I might start accepting donations to cover the cost of
            running the site or if you know of an institution who might be interested
            in sponsoring the project, an introduction would be appreciated.
          </p>

          <h2 class="font-battambang font-light text-2xl text-black mt-10 mb-4">
            Get in Touch
          </h2>

          <p>
            It's still under active development so if you have any questions,
            suggestions or just want to say hi, please feel free to send me your
            <a class="text-theme-violet hover:underline" href="mailto:feedback@inciteful.xyz">feedback</a>.
          </p>
        </div>
      </Container>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { Section, Container } from '@/components/ui/layouts'
import { TextLG } from '@/components/ui/typography'
</script>

<style scoped>
.prose p {
  @apply mb-4 leading-relaxed;
}
</style>
