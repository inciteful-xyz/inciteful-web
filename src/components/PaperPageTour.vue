<template>
  <Tour :name="name" :steps="steps" :ready="ready" />
</template>

<script>
import Tour from './Tour'

export default {
  name: 'PaperPageTour',
  components: { Tour },
  props: {
    ready: Boolean
  },
  data () {
    return {
      name: 'paperPageTour',
      startedTour: false,
      steps: [
        {
          target: '#logo',
          content: 'Let\'s take a tour of Inciteful',
          params: {
            placement: 'bottom',
            highlight: false
          },
          offset: -200
        },
        {
          target: '#paper-info',
          content: 'We have basic info about your paper',
          params: {
            placement: 'left'
          },
          offset: -100
        },
        {
          target: '#paper-stats',
          content: 'General Stats about the paper',
          params: {
            placement: 'bottom'
          },
          offset: -100
        },
        {
          target: '#graph-stats',
          content: 'Stats about the graph we created',
          params: {
            placement: 'top'
          },
          offset: -100
        },
        {
          target: '.similar-papers',
          content: 'Be sure to check out the most similar papers',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '.most-important-papers',
          content: 'Or the most important papers',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '.recent-papers',
          content: "Don't forget to look at the more recent papers",
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '.other-data',
          content:
            'We also have other interesting data about authors, institutions, or journals',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '#graph-filters',
          content: 'The filters narrow down the results in every table',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '.add-paper-button',
          content:
            'Use the + buttons to start adding papers to a custom graph.',
          offset: -100
        },
        {
          target: '.sql-button',
          content: 'Dig into the queries behind each table',
          offset: -200,
          params: {
            placement: 'right'
          }
        },
        {
          target: '.bibtex-export',
          content: 'Or just export the whole table into your reference manager',
          offset: -200,
          params: {
            placement: 'left'
          }
        },
        {
          target: '.paging',
          content: "Don't forget that every table pages",
          offset: -200,
          params: {
            placement: 'bottom'
          }
        }
      ]
    }
  }
}
</script>
