# Smart Mobility Research Atlas (atlas.mobilitypsu.com)

One plain-language page per representative paper of the Penn State Smart Mobility Lab, each with a
lead figure or video, key numbers, the story of the work, links to the paper, code, data and slides,
a ready-to-copy citation, and (for selected papers) a Chinese version.

Built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Where things come from

| What | Where it lives |
|---|---|
| Paper metadata: title, authors, venue, DOI, code/data/slides/PDF/video links | **Lab site** repo `xbhu/smart-mobility-lab-website`, `src/content/papers/<id>.md` |
| Research thrusts (names, order, taglines) | Lab site, `src/content/thrusts/` |
| Author profile links and photos | Lab site, `src/content/people/` |
| The Atlas story: one-sentence summary, lead media, key numbers, text, Chinese version | **This repo**, `src/content/atlas/<slug>/` |

The build reads <https://lab.mobilitypsu.com/data/papers.json> and `thrusts.json`, so a change to a
paper's metadata is made once, on the lab site. The Atlas rebuilds on every push here, every
Monday, and on demand (Actions → Deploy Atlas → Run workflow) to pick up lab-site edits.

## Adding a page

1. Make sure the paper exists on the lab site, with its links filled in (`code`, `data`, `slides`,
   `pdf`, `video`, `website`), and set `atlas_slug: <slug>` there so the lab site links to the page.
   Every page offers a PDF. Use our own manuscript from before the publisher's proofing (never
   the publisher-typeset PDF). If the paper has no repo holding it, add it here as
   `public/media/<slug>/<Author>_<Year>_<Short>_<Venue>.pdf` and point the lab site's `pdf` at
   `https://atlas.mobilitypsu.com/media/<slug>/<file>.pdf`.
2. Create `src/content/atlas/<slug>/en.md`. The slug is the URL: `atlas.mobilitypsu.com/<slug>/`.
   It is usually the lab site's paper id; if not, add `paper: <lab paper id>`.

   ```markdown
   ---
   tldr: One sentence on what the paper found or made possible.
   hero:
     image: /media/<slug>/lead.jpg      # or  youtube: <video id>  or  video: /media/<slug>/clip.mp4
     alt: What the image shows
     caption: Optional caption.
   key_numbers:
     - { value: "1.9 s", label: "to a full stop when both V2V radios fail" }
   updated: 2026-10-24
   draft: true                          # remove when the page is ready to publish
   ---

   ## What problem does this research solve?
   ## What did we do?
   ## What are the key findings?
   ## What can this be used for?
   ```

3. Optional Chinese version: `src/content/atlas/<slug>/zh.md` with `title:` (Chinese title),
   `tldr:`, translated `key_numbers` and the same sections in Chinese. The lead media is shared.
4. Images go in `public/media/<slug>/` (web-sized, under ~400 KB each). In the text, use
   `<figure><img src="/media/<slug>/fig.png" alt="..."><figcaption>...</figcaption></figure>`.

Pages with `draft: true` appear only in `npm run dev`, never on the live site.

## Working locally

```bash
npm ci
npm run dev                       # reads lab data from lab.mobilitypsu.com
# or, with a local build of the lab site next to this folder:
LAB_DATA_DIR=../smart-mobility-lab-website/dist/data npm run build
python3 tools/check_site.py dist .   # internal links, anchors, untracked media
```

## Old URLs

The previous Jekyll Atlas used `/papers/<slug>/`. Those URLs redirect to the new pages
(`src/lib/redirects.mjs`). The Jekyll version is kept on the `jekyll-archive` branch.
