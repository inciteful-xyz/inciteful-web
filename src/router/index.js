import qs from 'qs'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const DEFAULT_TITLE = 'Inciteful'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Using Citations to Explore Academic Literature',
      description:
        'Committed to open access, Inciteful uses the power of graph analysis to help you explore and find the most relevant academic literature.',
      canonical: '/'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'About',
      description: 'About Inciteful'
    }
  },
  // {
  //   path: '/einstein',
  //   name: 'Einstein',
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/Einstein.vue')
  // },
  {
    path: '/data',
    name: 'Data',
    component: () =>
      import(/* webpackChunkName: "data" */ '../views/DataSources.vue'),
    meta: {
      title: 'Data Sources',
      description: 'Where we get our data'
    }
  },
  // {
  //   path: '/search',
  //   name: 'Search',
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/Search.vue')
  // },
  // {
  //   path: '/beta',
  //   name: 'Beta',
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/BeatFeatures.vue')
  // },
  {
    path: '/p/q/*',
    name: 'PaperDiscoveryQuery',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/PaperDiscoveryQuery.vue')
  },
  {
    path: '/p/q',
    name: 'LitReviewQuery',
    component: () =>
      import(
        /* webpackChunkName: "paperDisovery" */ '../views/LitReviewQuery.vue'
      )
  },
  {
    path: '/p',
    name: 'LitReview',
    component: () =>
      import(/* webpackChunkName: "paperDisovery" */ '../views/LitReview.vue'),
    meta: {
      title: 'Paper Discovery',
      meta:
        'Use our Paper Discovery tool to quickly and easily find the most relevant literature.'
    }
  },
  {
    path: '/p/*',
    name: 'PaperDiscovery',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/PaperDiscovery.vue')
  },
  // {
  //   path: '/c',
  //   name: 'LitConnector',
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/LitConnector.vue')
  // }
  {
    path: '/*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  parseQuery: function (queryString) {
    console.log('parsing query: ' + queryString)
    return qs.parse(queryString)
  },
  stringifyQuery: function (params) {
    console.log('stringify query: ' + JSON.stringify(params))
    const result = qs.stringify(params, { encode: false })
    return result ? '?' + result : ''
  }
})

router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', to.meta.description || '')
  })
})

export default router
