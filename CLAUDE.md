# edugames

Small educational browser games for kids. Each game lives in its own folder as a
self-contained `index.html` (inline CSS + JS, no build step).

## Games

- `factorun/` — **Kraken Crossing**: steer a boat along a number line to answer
  addition facts (make-10 bonds, bridging over 10). Uses PixiJS 8 from jsDelivr,
  Web Audio for sound and `localStorage` for progress.
  Touch-first: designed for phones/tablets in landscape or portrait.

## Deploying

`.github/workflows/pages.yml` publishes to GitHub Pages on every push to `main`: every tracked
file except `.github/`, `CLAUDE.md` and `.claude/` folders. When adding a game, add a card for it
in the root `index.html`.

The deploy replaces `__BUILD__` in all HTML with the short commit hash and writes `version.json`.
`update.js` (included by every page) compares the two and shows a "New version · tap to update"
pill, which reloads with `?v=<hash>` to skip the Pages HTML cache. Games add `body.playing`
during a round to hide the pill. New games should include `<meta name="build" content="__BUILD__">`,
`<script src="../update.js">`, and the `../icons/` icon links.

Icons: `icons/icon.svg` is the source; PNGs (apple-touch-icon 180, 192, 512, favicon 32) are
rendered from it with headless Chromium. `manifest.webmanifest` makes the dashboard installable.

## Running

No dependencies beyond Python 3:

```bash
python3 -m http.server 8765 --bind 0.0.0.0   # from the repo root (games use ../update.js, ../icons/)
# open http://localhost:8765/ (dashboard) or /factorun/
```

Locally `__BUILD__` isn't stamped, so the update check stays off.

## Checking changes

There's no test suite. To verify a change, serve the folder and load it in headless
Chromium (Playwright is preinstalled in cloud sessions): check the console for errors,
click a level button (`.lvl[data-level="1"]`…`"4"`), and screenshot the canvas.

In cloud sessions jsDelivr may be blocked by the network policy (`PIXI is not defined`).
Workaround for testing only: `npm pack pixi.js@8.6.6`, extract `package/dist/pixi.min.js`,
and serve it via Playwright `page.route('**/pixi.min.js', r => r.fulfill({ path }))`.

## Conventions

- Keep each game a single dependency-light HTML file; pin CDN library versions.
- Mobile first: large tap targets, no hover-only UI, `touch-action: none` on the game.
- Child-friendly copy: short sentences, encouraging feedback.
