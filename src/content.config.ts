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
    // Institutions as printed on the paper, and for each author (in lab-site order) the
    // 1-based indexes of their institutions, e.g. [[1], [2, 1], [1]].
    affiliations: z.array(z.string()).optional(),
    author_affiliations: z.array(z.array(z.number().int().min(1))).optional(),
    // The paper's abstract, shown folded under the story for readers who want the original.
    abstract: z.string().optional(),
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
    // Media coverage of the paper, shown as a row of links under the resource buttons.
    press: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
    // Shown as the lead story on the home page (the most recently updated featured page wins).
    featured: z.boolean().optional(),
    updated: date.optional(),
    // Drafts are built only in development (npm run dev), never on the live site.
    draft: z.boolean().optional(),
  }),
});

export const collections = { atlas };
