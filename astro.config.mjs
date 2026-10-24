import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { legacyRedirects } from "./src/lib/redirects.mjs";

export default defineConfig({
  site: "https://atlas.mobilitypsu.com",
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Old Jekyll URLs (/papers/<slug>/) keep working; see src/lib/redirects.mjs.
  redirects: legacyRedirects,
  integrations: [sitemap({ filter: (page) => !page.includes("/papers/") })],
});
