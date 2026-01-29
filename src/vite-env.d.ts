/// <reference types="vite/client" />

declare global {
  const __COMMIT_HASH__: string
}

interface ImportMetaEnv {
  readonly VITE_CLIENT_API_URL: string
  readonly VITE_SHOW_LOGIN: string
  readonly VITE_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
