import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import router from './router'
import store from './store'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTour from 'v3-tour'
import VueClickAway from 'vue3-click-away'
import Vue3TouchEvents from 'vue3-touch-events'

import './assets/tailwind.css'

// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'
import 'firebase/firestore'

const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.emitter = emitter

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    app,
    dsn:
      'https://e0f9638a22234f65b69a22a10537ab95@o415910.ingest.sentry.io/5512736',
    integrations: [new Integrations.BrowserTracing()],
    release: 'inciteful-js@' + process.env.__COMMIT_HASH__,
    environment: process.env.NODE_ENV,
    tracingOptions: {
      trackComponents: true
    },
    tracesSampleRate: 1.0
  })
}

require('v3-tour/dist/vue-tour.css')
app
  .use(router)
  .use(store)
  .use(VueTour)
  .use(VueClickAway)
  .use(Vue3TouchEvents)

app.mount('#app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB9dUX17PnfFy3z5zc6AQLvTKhCbiTU_As',
  authDomain: 'inciteful-xyz.firebaseapp.com',
  projectId: 'inciteful-xyz',
  storageBucket: 'inciteful-xyz.appspot.com',
  messagingSenderId: '1019177502693',
  appId: '1:1019177502693:web:14a3ba42f1256dbd56110c'
}

// Initialize Firebase
// const fbapp = initializeApp(firebaseConfig)
firebase.initializeApp(firebaseConfig)
