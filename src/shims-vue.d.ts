/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

// Vue Router type augmentation
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}

export {}
