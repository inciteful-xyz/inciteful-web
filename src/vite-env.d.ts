/// <reference types="vite/client" />

declare const __COMMIT_HASH__: string

interface ImportMetaEnv {
  readonly VITE_CLIENT_API_URL: string
  readonly VITE_SHOW_LOGIN: string
  readonly VITE_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
