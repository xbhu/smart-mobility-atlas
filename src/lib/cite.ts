// APA 7 and BibTeX citations generated from the lab site's paper metadata.
// A paper's `citation_apa` on the lab site, when set, replaces the generated APA text.
import type { LabPaper } from "./lab";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "Qing Tang" -> { family: "Tang", given: ["Qing"] }; "G. List" -> { family: "List", given: ["G."] } */
function splitName(name: string) {
  const parts = name.replace(/\s+/g, " ").trim().split(" ");
  const family = parts.pop() ?? name;
  return { family, given: parts };
}

/** "Xian-Biao" -> "X.-B.", "G." -> "G." */
const initials = (given: string[]) =>
  given
    .map((g) => g.split("-").map((p) => (p.endsWith(".") ? p : `${p[0]}.`)).join("-"))
    .join(" ");

function apaAuthors(paper: LabPaper): string {
  const names = paper.authors.map((a) => {
    const { family, given } = splitName(a.name);
    return given.length ? `${family}, ${initials(given)}` : family;
  });
  if (names.length === 1) return names[0];
  if (names.length <= 20) return `${names.slice(0, -1).join(", ")}, & ${names.at(-1)}`;
  return `${names.slice(0, 19).join(", ")}, . . . ${names.at(-1)}`;
}

// Words kept capitalized in sentence case (proper nouns that appear in lab paper titles).
const PROPER = new Set([
  "United", "States", "U.S.", "America", "American", "Pennsylvania", "Missouri", "Colorado", "Texas",
  "Florida", "Bayesian", "Markov", "Monte", "Carlo", "Kalman", "Friedman", "Lagrangian", "Eulerian",
  "Gaussian", "Newell", "Vickrey", "Y-network", "I-81", "I-40",
]);

/** APA sentence case: lowercase except the first word, the first word after a colon, acronyms and proper nouns. */
export function sentenceCase(title: string): string {
  let capNext = true;
  return title
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const out = tok
        .split("-")
        .map((part, i) => {
          const core = part.replace(/[^A-Za-z.]/g, "");
          const keep =
            PROPER.has(core) || PROPER.has(part) || /[A-Z].*[A-Z]/.test(core) || /\d/.test(part) || (capNext && i === 0);
          return keep ? part : part.toLowerCase();
        })
        .join("-");
      capNext = /[:?!]$/.test(tok);
      return out;
    })
    .join("");
}

const isNumber = (s: string) => /^\d+$/.test(s);

/** APA reference as HTML (italics for venue and volume). */
export function apaHtml(paper: LabPaper): string {
  if (paper.citation_apa) return esc(paper.citation_apa);
  const year = paper.status === "accepted" ? "in press" : String(paper.year);
  const title = sentenceCase(paper.title.trim()).replace(/[.?!]$/, "");
  const doi = paper.doi ? ` https://doi.org/${paper.doi}` : paper.url ? ` ${paper.url}` : "";
  const head = `${esc(apaAuthors(paper))} (${year}).`;
  if (paper.status === "under-review") return `${head} ${esc(title)} [Manuscript submitted for publication].`;
  if (paper.type === "report") return `${head} <em>${esc(title)}</em>. ${esc(paper.venue)}.${esc(doi)}`;
  if (paper.type === "conference" || paper.type === "chapter") {
    return `${head} ${esc(title)}. In <em>${esc(paper.venue)}</em>${paper.pages ? ` (pp. ${esc(paper.pages)})` : ""}.${esc(doi)}`;
  }
  let src = `<em>${esc(paper.venue)}</em>`;
  if (paper.volume) src += `, <em>${esc(paper.volume)}</em>${paper.issue ? `(${esc(paper.issue)})` : ""}`;
  if (paper.pages) src += isNumber(paper.pages) ? `, Article ${esc(paper.pages)}` : `, ${esc(paper.pages)}`;
  return `${head} ${esc(title)}. ${src}.${esc(doi)}`;
}

const STOP = new Set(["a", "an", "the", "on", "of", "for", "in", "to", "and", "with", "via", "toward", "towards"]);

export function bibtex(paper: LabPaper): string {
  const first = splitName(paper.authors[0]?.name ?? "anon").family.toLowerCase().replace(/[^a-z]/g, "");
  const word = paper.title.toLowerCase().split(/[^a-z0-9]+/).find((w) => w && !STOP.has(w)) ?? "paper";
  const key = `${first}${paper.year}${word}`;
  const authors = paper.authors
    .map((a) => {
      const { family, given } = splitName(a.name);
      return given.length ? `${family}, ${given.join(" ")}` : family;
    })
    .join(" and ");
  const type =
    paper.type === "conference" ? "inproceedings" : paper.type === "report" ? "techreport" : paper.type === "chapter" ? "incollection" : "article";
  const venueField = paper.type === "report" ? "institution" : paper.type === "journal" ? "journal" : "booktitle";
  const fields: [string, string | null][] = [
    ["title", `{${paper.title.trim()}}`],
    ["author", authors],
    [venueField, paper.venue],
    ["volume", paper.volume],
    ["number", paper.issue],
    ["pages", paper.pages ? paper.pages.replace(/[–—-]/, "--") : null],
    ["year", String(paper.year)],
    ["doi", paper.doi],
    ["url", !paper.doi ? paper.url : null],
    ["note", paper.status === "accepted" ? "In press" : paper.status === "under-review" ? "Under review" : null],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(",\n");
  return `@${type}{${key},\n${body}\n}`;
}
