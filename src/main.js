import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import './styles/style.scss'
import api from './utils/api'
import widgets from './widgets'
import navigation from './navigation'
import options from './utils/options'
import VueTour from 'vue-tour'

import VueSocialSharing from 'vue-social-sharing'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue: Vue,
    dsn: 'https://e0f9638a22234f65b69a22a10537ab95@o415910.ingest.sentry.io/5512736',
    integrations: [
      new Integrations.BrowserTracing()
    ],
    release: 'inciteful-js@' + process.env.__COMMIT_HASH__,
    environment: process.env.NODE_ENV,
    tracingOptions: {
      trackComponents: true
    },
    tracesSampleRate: 1.0
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)
Vue.use(VueSocialSharing)

export default {
  widgets,
  navigation,
  api,
  options
}
