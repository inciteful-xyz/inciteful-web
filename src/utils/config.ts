// Central configuration from environment variables

// Declare process for Node.js environment (when running scripts)
declare const process: { env: Record<string, string | undefined> } | undefined;

// Handle both Vite (import.meta.env) and Node.js (process.env) environments
function getEnvVar(key: string, fallback: string): string {
  // Try Vite environment first
  try {
    // @ts-ignore - import.meta.env is Vite-specific
    if (import.meta.env?.[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {
    // Not in Vite context
  }

  // Try Node.js process.env
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key] as string;
  }

  return fallback;
}

export const SITE_URL = getEnvVar("VITE_SITE_URL", "https://incitefulmed.com");
export const BASE_PATH = getEnvVar("VITE_BASE_PATH", "/");
// "Inciteful Academic", not "Inciteful": the Med homepage at the site root owns
// the bare brand name, and Google supports one site name per host.
export const SITE_NAME = "Inciteful Academic";

// The Inciteful Med homepage, at the root of the host Academic is served under.
export const MED_HOME_URL = `${SITE_URL}/`;

/**
 * Build a full URL with site URL and base path
 * Removes trailing slashes for canonical URL consistency, except on the root,
 * which keeps its slash because the server 307s `/academic` to `/academic/`
 * @param path - Path relative to base (e.g., '/about' or '/p/123')
 * @returns Full URL (e.g., 'https://incitefulmed.com/academic/about', or 'https://incitefulmed.com/academic/' for the root)
 */
export function buildUrl(path: string): string {
  // Normalize base path (ensure it ends with /)
  const base = BASE_PATH.endsWith("/") ? BASE_PATH : BASE_PATH + "/";
  // Normalize path (remove leading /)
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  // For root path, return site + base with its trailing slash
  if (!normalizedPath) {
    return `${SITE_URL}${base}`;
  }

  let url = `${SITE_URL}${base}${normalizedPath}`;

  // Remove trailing slash
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
}
