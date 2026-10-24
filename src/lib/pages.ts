// Atlas pages joined with their lab-site paper metadata.
import { getCollection, type CollectionEntry } from "astro:content";
import { lab, labPaper, type LabPaper, type LabThrust } from "./lab";
import type { Lang } from "./i18n";

export interface AtlasPage {
  slug: string;
  paper: LabPaper;
  en: CollectionEntry<"atlas">;
  zh?: CollectionEntry<"atlas">;
  /** Primary thrust (the paper's first thrust on the lab site). */
  thrust: LabThrust;
}

const showDrafts = import.meta.env.DEV;
const warned = new Set<string>();

/** Published Atlas pages (plus drafts in `npm run dev`), newest paper first. */
export async function atlasPages(): Promise<AtlasPage[]> {
  const entries = await getCollection("atlas", (e) => showDrafts || !e.data.draft);
  const bySlug = new Map<string, Partial<Record<Lang, CollectionEntry<"atlas">>>>();
  for (const e of entries) {
    const [slug, lang] = e.id.split("/") as [string, Lang];
    bySlug.set(slug, { ...bySlug.get(slug), [lang]: e });
  }
  const { thrusts } = await lab();
  const pages: AtlasPage[] = [];
  for (const [slug, v] of bySlug) {
    if (!v.en) throw new Error(`Atlas page "${slug}" has zh.md but no en.md`);
    const paper = await labPaper(v.en.data.paper ?? slug);
    const thrust = thrusts.find((t) => t.id === paper.thrusts[0]);
    if (!thrust) throw new Error(`Paper "${paper.id}" has unknown thrust "${paper.thrusts[0]}"`);
    if (!import.meta.env.DEV && paper.atlas_slug !== slug && !warned.has(slug)) {
      warned.add(slug);
      console.warn(`[atlas] ${slug}: set atlas_slug: ${slug} on the lab site paper "${paper.id}" so it links here`);
    }
    pages.push({ slug, paper, en: v.en, zh: v.zh, thrust });
  }
  return pages.sort((a, b) => b.paper.year - a.paper.year || a.paper.title.localeCompare(b.paper.title));
}

/** Image used for cards and social previews. */
export function pageImage(p: AtlasPage): string | null {
  const h = p.en.data.hero;
  if (h?.image) return h.image;
  if (h?.poster) return h.poster;
  if (h?.youtube) return `https://i.ytimg.com/vi/${h.youtube}/hqdefault.jpg`;
  return null;
}

export const pagePath = (slug: string, lang: Lang = "en") => (lang === "zh" ? `/${slug}/zh/` : `/${slug}/`);
