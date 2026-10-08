# edugames

Small educational browser games for kids. Each game lives in its own folder as a
self-contained `index.html` (inline CSS + JS, no build step).

## Games

- `factorun/` — **Kraken Crossing**: steer a boat along a number line to answer
  addition facts (make-10 bonds, bridging over 10). Uses PixiJS 8 from jsDelivr,
  Web Audio for sound and `localStorage` for progress.
  Touch-first: designed for phones/tablets in landscape or portrait.
- `robber-chase/` — **Robber Chase** (ages 3–5): two robber cars pull trailers of loot; tap the one
  with more to catch it. Teaches more/less and early counting with no numbers to read
  (dice-pattern piles, one-to-one matching after a wrong pick, coins counted into a chest with
  rising notes). No voice-over: a grown-up gives the instructions. No way to lose.
  Split into ES modules (no build step): `js/levels.js` (pair ranges + how piles look),
  `js/game.js` (phase flow), `js/assets/` (cars, robber, loot, buildings, sounds),
  `js/view/` (street, cars, HUD, compare panel). Saves totals under `robber-chase-v1`,
  which the root dashboard reads. Best in landscape.

## Deploying

`.github/workflows/pages.yml` publishes to GitHub Pages on every push to `main`:
the root `index.html` (game list) plus each top-level folder that has an `index.html`.
When adding a game, add a link to it in the root `index.html`.

## Running

No dependencies beyond Python 3:

```bash
cd factorun && python3 -m http.server 8765 --bind 0.0.0.0
# open http://localhost:8765
```

`factorun/.claude/launch.json` holds the same config for the Claude preview pane
(`robber-chase/.claude/launch.json` serves Robber Chase on port 8766). Games split into
ES modules need http, not `file://`.

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
