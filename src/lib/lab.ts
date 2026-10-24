// Paper metadata and research thrusts come from the lab site (lab.mobilitypsu.com), which is the
// single source for titles, authors, venues and resource links. The Atlas only stores its own
// narrative (summary, figures, Chinese translation) and reads the rest here at build time.
//
// Default source: https://lab.mobilitypsu.com/data/*.json
// For local work, point LAB_DATA_DIR at a built copy of the lab site, e.g.
//   LAB_DATA_DIR=../smart-mobility-lab-website/dist/data npm run build
import fs from "node:fs";
import path from "node:path";

export const LAB_URL = "https://lab.mobilitypsu.com";
const DATA_URL = process.env.LAB_DATA_URL ?? `${LAB_URL}/data`;
const DATA_DIR = process.env.LAB_DATA_DIR;

export interface LabAuthor {
  name: string;
  person: string | null;
  corresponding: boolean;
  profile_url: string | null;
  photo: string | null;
  role: string | null;
}

export interface LabPaper {
  id: string;
  title: string;
  authors: LabAuthor[];
  year: number;
  type: "journal" | "conference" | "chapter" | "report";
  venue: string;
  venue_short: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  doi: string | null;
  url: string | null;
  status: "published" | "accepted" | "under-review";
  thrusts: string[];
  subtopic: string;
  featured: boolean;
  summary: string | null;
  atlas_slug: string | null;
  code: string | null;
  data: string | null;
  website: string | null;
  slides: string | null;
  pdf: string | null;
  video: string | null;
  citation_apa: string | null;
}

export interface LabThrust {
  id: string;
  name: string;
  order: number;
  tagline: string;
  url: string;
  image: string | null;
  subtopics: { id: string; name: string }[];
  featured_papers: string[];
}

async function load<T>(name: string): Promise<T> {
  if (DATA_DIR) return JSON.parse(fs.readFileSync(path.resolve(DATA_DIR, `${name}.json`), "utf8"));
  const res = await fetch(`${DATA_URL}/${name}.json`);
  if (!res.ok) throw new Error(`Could not load ${DATA_URL}/${name}.json (HTTP ${res.status})`);
  return res.json();
}

let cache: Promise<{ papers: Map<string, LabPaper>; thrusts: LabThrust[] }> | undefined;

/** Lab papers (by id) and thrusts (in display order), loaded once per build. */
export function lab() {
  cache ??= (async () => {
    const [p, t] = await Promise.all([
      load<{ papers: LabPaper[] }>("papers"),
      load<{ thrusts: LabThrust[] }>("thrusts"),
    ]);
    return {
      papers: new Map(p.papers.map((x) => [x.id, x])),
      thrusts: [...t.thrusts].sort((a, b) => a.order - b.order),
    };
  })();
  return cache;
}

export async function labPaper(id: string): Promise<LabPaper> {
  const paper = (await lab()).papers.get(id);
  if (!paper) throw new Error(`Atlas page refers to paper "${id}", which is not in ${LAB_URL}/data/papers.json`);
  return paper;
}
