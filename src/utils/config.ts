// Central configuration from environment variables

// Declare process for Node.js environment (when running scripts)
declare const process: { env: Record<string, string | undefined> } | undefined

// Handle both Vite (import.meta.env) and Node.js (process.env) environments
function getEnvVar(key: string, fallback: string): string {
  // Try Vite environment first
  try {
    // @ts-ignore - import.meta.env is Vite-specific
    if (import.meta.env?.[key]) {
      // @ts-ignore
      return import.meta.env[key]
    }
  } catch {
    // Not in Vite context
  }

  // Try Node.js process.env
  if (typeof process !== 'undefined' && process?.env?.[key]) {
    return process.env[key] as string
  }

  return fallback
}

export const SITE_URL = getEnvVar('VITE_SITE_URL', 'https://inciteful.xyz')
export const BASE_PATH = getEnvVar('VITE_BASE_PATH', '/')
export const SITE_NAME = 'Inciteful'

/**
 * Build a full URL with site URL and base path
 * @param path - Path relative to base (e.g., '/about' or '/p/123')
 * @returns Full URL (e.g., 'https://inciteful.xyz/app/about')
 */
export function buildUrl(path: string): string {
  // Normalize base path (ensure it ends with /)
  const base = BASE_PATH.endsWith('/') ? BASE_PATH : BASE_PATH + '/'
  // Normalize path (remove leading /)
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  // For root path, just return site + base
  if (!normalizedPath) {
    return `${SITE_URL}${BASE_PATH}`
  }
  return `${SITE_URL}${base}${normalizedPath}`
}
