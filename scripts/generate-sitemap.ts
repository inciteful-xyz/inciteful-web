/**
 * Sitemap Generator for Inciteful
 *
 * This script generates a sitemap.xml for static routes.
 * For dynamic paper pages, you would need to:
 * 1. Query your database for all paper IDs
 * 2. Add them to the sitemap dynamically
 * 3. Consider using sitemap index files if >50k URLs
 *
 * Run with: node --loader tsx scripts/generate-sitemap.ts
 */

import fs from "fs";
import path from "path";
import { buildUrl } from "../src/utils/config";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

// Static routes from your router
const staticRoutes: SitemapUrl[] = [
  {
    loc: "/",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    loc: "/about",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    loc: "/data",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    loc: "/c",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    loc: "/p",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    loc: "/einstein",
    changefreq: "monthly",
    priority: 0.6,
  },
];

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const lastmod = new Date().toISOString().split("T")[0];

  const urlEntries = urls
    .map((url) => {
      const loc = buildUrl(url.loc);
      const lastmodTag = url.lastmod || lastmod;
      const changefreqTag = url.changefreq
        ? `    <changefreq>${url.changefreq}</changefreq>`
        : "";
      const priorityTag =
        url.priority !== undefined
          ? `    <priority>${url.priority}</priority>`
          : "";

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmodTag}</lastmod>${changefreqTag ? "\n" + changefreqTag : ""}${priorityTag ? "\n" + priorityTag : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateRobotsTxt(): string {
  const sitemapUrl = buildUrl("/sitemap.xml");

  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /p/q

# Sitemap location
Sitemap: ${sitemapUrl}
`;
}

function generateSitemap() {
  const publicDir = path.join(process.cwd(), "public");

  // Generate sitemap.xml
  const sitemap = generateSitemapXml(staticRoutes);
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemap, "utf-8");
  console.log(`✅ Sitemap generated at ${sitemapPath}`);
  console.log(`📊 Total URLs: ${staticRoutes.length}`);

  // Generate robots.txt
  const robotsTxt = generateRobotsTxt();
  const robotsPath = path.join(publicDir, "robots.txt");
  fs.writeFileSync(robotsPath, robotsTxt, "utf-8");
  console.log(`✅ robots.txt generated at ${robotsPath}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap, staticRoutes };
