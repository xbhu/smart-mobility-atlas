"""Check the built site (dist/) for broken internal links, missing anchors, and missing
images/videos. Usage: python3 tools/check_site.py dist . ; exits 1 on any problem.
External links are not fetched; they are only counted."""
import os, re, sys, json, subprocess
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote, urldefrag
DIST = sys.argv[1]; REPO = sys.argv[2]
tracked = set(subprocess.check_output(["git","-C",REPO,"ls-files","public"],text=True).split("\n"))
tracked = {t[len("public/"):] for t in tracked if t}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.links=[]; s.ids=set()
    def handle_starttag(s, tag, a):
        a=dict(a)
        if a.get("id"): s.ids.add(a["id"])
        if tag=="a" and a.get("name"): s.ids.add(a["name"])
        for k in ("href","src","poster","data-src"):
            if a.get(k): s.links.append((tag,k,a[k]))
        if a.get("srcset"):
            for part in a["srcset"].split(","):
                u=part.strip().split(" ")[0]
                if u: s.links.append((tag,"srcset",u))
        if tag=="meta" and a.get("content","").startswith(("http","/")) and (a.get("property","").startswith("og:image") or a.get("name","").startswith("twitter:image")):
            s.links.append((tag,"meta",a["content"]))
pages={}
for root,_,files in os.walk(DIST):
    for f in files:
        if f.endswith(".html"):
            p=os.path.join(root,f); rel="/"+os.path.relpath(p,DIST)
            pr=P(); pr.feed(open(p,encoding="utf8").read()); pages[rel]=pr
def page_for(path):
    path=unquote(path)
    for c in (path, path.rstrip("/")+"/index.html", path+".html"):
        if c in pages: return c
    return None
problems=[]; external={}
n=0
for rel,pr in pages.items():
    for tag,k,u in pr.links:
        if u.startswith(("mailto:","tel:","javascript:","data:")): continue
        if u.startswith("//"): u="https:"+u
        pu=urlparse(u)
        if pu.scheme in ("http","https"):
            if pu.netloc in ("atlas.mobilitypsu.com",): u=pu.path or "/"; pu=urlparse(u+("#"+pu.fragment if pu.fragment else ""))
            else:
                external.setdefault(u,set()).add(rel); continue
        n+=1
        path=pu.path or rel
        if not path.startswith("/"):
            base=os.path.dirname(rel); path=os.path.normpath(os.path.join(base,path))
        # anchor-only
        target=None
        fs=os.path.join(DIST,path.lstrip("/"))
        pg=page_for(path)
        if pg: target=pg
        elif os.path.isfile(fs):
            target="FILE"
            relf=path.lstrip("/")
            if relf in set(["_astro"]) : pass
            if not relf.startswith("_astro/") and relf not in tracked and not relf.endswith((".html",)):
                problems.append((rel,u,"file exists in build but is NOT tracked in git"))
        else:
            problems.append((rel,u,"missing target")); continue
        if pu.fragment and target and target!="FILE":
            if unquote(pu.fragment) not in pages[target].ids:
                problems.append((rel,u,"anchor not found"))
print("internal refs checked:",n,"pages:",len(pages))
for p in sorted(set(problems)): print("PROBLEM",*p,sep=" | ")
print("external urls (not fetched):",len(external))
sys.exit(1 if problems else 0)
