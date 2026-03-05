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
 * Removes trailing slashes for canonical URL consistency
 * @param path - Path relative to base (e.g., '/about' or '/p/123')
 * @returns Full URL without trailing slash (e.g., 'https://inciteful.xyz/about')
 */
export function buildUrl(path: string): string {
  // Normalize base path (ensure it ends with /)
  const base = BASE_PATH.endsWith('/') ? BASE_PATH : BASE_PATH + '/'
  // Normalize path (remove leading /)
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  let url: string
  // For root path, just return site + base
  if (!normalizedPath) {
    url = `${SITE_URL}${BASE_PATH}`
  } else {
    url = `${SITE_URL}${base}${normalizedPath}`
  }

  // Remove trailing slash (but keep the URL valid - don't remove from bare domain)
  if (url.endsWith('/') && url !== `${SITE_URL}/`) {
    url = url.slice(0, -1)
  }

  return url
}
