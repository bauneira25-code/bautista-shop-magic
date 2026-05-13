import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mockData";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/categorias", changefreq: "weekly", priority: "0.8" },
          { path: "/grupos", changefreq: "hourly", priority: "0.9" },
          { path: "/search", changefreq: "weekly", priority: "0.5" },
          { path: "/customize", changefreq: "weekly", priority: "0.6" },
          { path: "/registrar-marca", changefreq: "monthly", priority: "0.5" },
        ];

        for (const c of CATEGORIES) {
          entries.push({ path: `/categorias/${c.id}`, changefreq: "weekly", priority: "0.7" });
        }
        for (const p of MOCK_PRODUCTS) {
          entries.push({ path: `/products/${p.slug}`, changefreq: "weekly", priority: "0.7" });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
