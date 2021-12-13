import qs from 'qs'
import Vue from 'vue'
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import Home from '../views/Home.vue'
import pagedata from '../utils/pagedata'

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
  {
    path: '/einstein',
    name: 'Einstein',
    component: () =>
      import(/* webpackChunkName: "connector" */ '../views/Einstein.vue'),
    meta: {
      title: 'Six Degrees of Albert Einstein',
      description:
        "See how your work is connected to one of Einstein's seminal papers."
    }
  },
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
  {
    path: '/search',
    name: 'Search',
    component: () =>
      import(/* webpackChunkName: "search" */ '../views/Search.vue'),
    meta: {
      title: 'Search for Papers'
    }
  },
  {
    path: '/beta',
    name: 'Beta',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/BetaFeatures.vue'),
    meta: {
      title: 'Enable and Play with Inciteful Beta Features'
    }
  },
  {
    path: '/p/q/*',
    name: 'PaperDiscoveryQuery',
    component: () =>
      import(
        /* webpackChunkName: "discovery" */ '../views/PaperDiscoveryQuery.vue'
      ),
    meta: {
      title: 'Paper Discovery Query',
      description:
        "Use our Query tool to make custom queries on the paper's graph."
    }
  },
  {
    path: '/p/q',
    name: 'LitReviewQuery',
    component: () =>
      import(
        /* webpackChunkName: "discovery" */ '../views/LitReviewQuery.vue'
      ),
    meta: {
      title: 'Literature Review Query',
      description:
        "Use our Query tool to make custom queries on the graph you've built."
    }
  },
  {
    path: '/p',
    name: 'LitReview',
    component: () =>
      import(/* webpackChunkName: "discovery" */ '../views/LitReview.vue'),
    meta: {
      title: 'Literature Review',
      description:
        'Use our Paper Discovery tool to quickly and easily find the most relevant literature.'
    }
  },
  {
    path: '/p/*',
    name: 'PaperDiscovery',
    component: () =>
      import(/* webpackChunkName: "discovery" */ '../views/PaperDiscovery.vue'),
    meta: {
      title: 'Paper Discovery',
      description:
        'Use our Paper Discovery tool to quickly and easily find the most relevant literature.'
    }
  },
  {
    path: '/c',
    name: 'LitConnector',
    component: () =>
      import(/* webpackChunkName: "connector" */ '../views/LitConnector.vue'),
    meta: {
      title: 'Literature Connector',
      description:
        'Use our Literature Connector to Discover How Two Papers are Connected'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  },
  // if you omit the last `*`, the `/` character in params will be encoded when resolving or pushing
  {
    path: '/:pathMatch(.*)',
    name: 'bad-not-found',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,

  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },

  // parseQuery: function (queryString) {
  //   return qs.parse(queryString)
  // },

  stringifyQuery: function (params) {
    const result = qs.stringify(params, {
      arrayFormat: 'brackets'
    })
    return result ? '?' + result : ''
  }
})

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    pagedata.setTitle(to.meta.title as string)
    pagedata.setDescription(to.meta.description as string)
  })
})
export default router
