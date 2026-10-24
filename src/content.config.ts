// Atlas pages: src/content/atlas/<slug>/en.md (required) and zh.md (optional Chinese version).
// <slug> is the URL (atlas.mobilitypsu.com/<slug>/). Paper metadata is not stored here; it comes
// from the lab site through `paper` (see src/lib/lab.ts).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// YAML reads 2026-10-24 as a date; keep it as the text "2026-10-24".
const date = z.union([
  z.date().transform((d) => d.toISOString().slice(0, 10)),
  z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "use YYYY-MM or YYYY-MM-DD"),
]);

const atlas = defineCollection({
  loader: glob({ pattern: "*/{en,zh}.md", base: "./src/content/atlas" }),
  schema: z.object({
    // Paper id on the lab site (src/content/papers/<id>.md there). Defaults to the folder name.
    paper: z.string().optional(),
    // Chinese title (zh.md). The English title always comes from the lab site.
    title: z.string().optional(),
    // One sentence: what the paper found or made possible.
    tldr: z.string(),
    // Lead image or video under the title. Use one of image, youtube or video.
    hero: z
      .object({
        image: z.string().optional(),
        youtube: z.string().optional(),
        start: z.number().int().optional(),
        video: z.string().optional(), // site-hosted .mp4 under /media/<slug>/
        poster: z.string().optional(),
        loop: z.boolean().optional(),
        alt: z.string().optional(),
        caption: z.string().optional(),
        credit: z.string().optional(),
      })
      .optional(),
    // Three to five headline numbers, e.g. { value: "1.9 s", label: "to a full stop when both radios fail" }.
    key_numbers: z.array(z.object({ value: z.string(), label: z.string() })).max(5).optional(),
    updated: date.optional(),
    // Drafts are built only in development (npm run dev), never on the live site.
    draft: z.boolean().optional(),
  }),
});

export const collections = { atlas };
