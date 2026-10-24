"""Full-page screenshots of the built Atlas (dist/) for review before a page goes live.

Usage:
  python3 tools/screenshot.py OUT_DIR /path/|name|width [/other/|name|width ...]
  e.g. python3 tools/screenshot.py /tmp/shots "/|home|1280" "/my-paper/|paper|1280" "/my-paper/|paper-phone|390"

Serves dist/ itself on a free local port, scrolls each page so lazy images load, then saves
OUT_DIR/<name>.png. Images from lab.mobilitypsu.com (author photos, thrust pictures) are served
from a local copy of the lab site when LAB_PUBLIC points at its public/ folder, e.g.
  LAB_PUBLIC=../smart-mobility-lab-website/public python3 tools/screenshot.py ...
Needs Python Playwright with Chromium.
"""
import asyncio
import functools
import http.server
import mimetypes
import os
import socketserver
import sys
import threading

from playwright.async_api import async_playwright

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
LAB_PUBLIC = os.environ.get("LAB_PUBLIC")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve():
    handler = functools.partial(QuietHandler, directory=DIST)
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


async def lab_route(route):
    path = route.request.url.split("lab.mobilitypsu.com", 1)[1].split("?")[0]
    f = os.path.join(LAB_PUBLIC, path.lstrip("/")) if LAB_PUBLIC else ""
    if f and os.path.isfile(f):
        await route.fulfill(path=f, content_type=mimetypes.guess_type(f)[0] or "application/octet-stream")
    else:
        await route.abort()


async def main(out_dir, shots):
    os.makedirs(out_dir, exist_ok=True)
    httpd = serve()
    base = f"http://127.0.0.1:{httpd.server_address[1]}"
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for shot in shots:
            path, name, width = shot.split("|")
            page = await browser.new_page(viewport={"width": int(width), "height": 900})
            await page.route("https://lab.mobilitypsu.com/**", lab_route)
            await page.goto(base + path, wait_until="load", timeout=30000)
            await page.evaluate(
                """async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) {
                     window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
                   window.scrollTo(0, 0); }"""
            )
            await page.wait_for_timeout(1200)
            out = os.path.join(out_dir, f"{name}.png")
            await page.screenshot(path=out, full_page=True)
            print(out)
            await page.close()
        await browser.close()
    httpd.shutdown()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asyncio.run(main(sys.argv[1], sys.argv[2:]))
