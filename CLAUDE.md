# edugames

Small educational browser games for kids. Each game lives in its own folder with an
`index.html` entry point. No build step: games use plain CSS files and native ES modules.

## Games

- `krakens-crossing/` — **Krakens Crossing**: steer a boat along a number line to answer
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

- `bubble-pop/` — **Bubble Pop** (ages 5–8): numbered bubbles float up; tap two that make the target
  (10, mixed 6–10, or 20) before they reach the top. One-minute arcade rounds; score = pairs popped,
  with combos. After the first tap the sign turns into "3 + ? = 10" (with a ten-frame on easier levels),
  a wrong pair shows what it does make, and the partner glows after a few seconds. No way to lose.
  Same module split as Robber Chase: `js/levels.js` (targets, speed, decoy rate), `js/game.js` (spawning
  + round flow), `js/view/` (sea, bubbles, HUD/sign). Saves `{pairs, rounds, best}` under `bubble-pop-v1`,
  which the root dashboard reads.

### Krakens Crossing layout (`krakens-crossing/`)

- `index.html` – markup only; `css/style.css` – menu/overlay/button styles.
- `js/main.js` – entry: assembles the scene, wires the menu, runs the ticker loop.
- `js/levels.js` – **level definitions** (facts, steps, colours; menu buttons are generated
  from it). `js/steps.js` – the question types (bond / split / total / direct).
- `js/game.js` – round → problem → step state machine. `js/practice.js` – fact picking and
  progress stats. `js/storage.js` – `localStorage` (the root dashboard reads the same key).
- `js/assets/` – art (boat, lighthouse, rock, wave, surprise props) and `sounds.js` (sfx).
- `js/view/` – scene pieces: sea, boat, crossing, number line, top bar, ten-frames.
- `js/fx.js` – particles/tweens/comic words; `js/surprises.js` – wrong-answer slapstick + celebration.
- `js/state.js` – shared mutable state (`S`, `settings`, layout `L`/`H`); mutate, never reassign.
- `js/layout.js`, `js/input.js`, `js/dom.js`, `js/clock.js` (game time + `later()`), `js/audio.js` (synth).

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
# open http://localhost:8765/ (dashboard) or /krakens-crossing/
```

Locally `__BUILD__` isn't stamped, so the update check stays off.

`krakens-crossing/.claude/launch.json`, `robber-chase/.claude/launch.json` (port 8766) and
`bubble-pop/.claude/launch.json` (port 8767) hold per-game
configs for the Claude preview pane; serving from the root as above works for both.

## Checking changes

There's no test suite. To verify a change, serve the folder and load it in headless
Chromium (Playwright is preinstalled in cloud sessions; ES modules need http, not `file://`): check the console for errors,
click a level button (`.lvl[data-level="1"]`…`"4"`), and screenshot the canvas.

In cloud sessions jsDelivr may be blocked by the network policy (`PIXI is not defined`).
Workaround for testing only: `npm pack pixi.js@8.6.6`, extract `package/dist/pixi.min.js`,
and serve it via Playwright `page.route('**/pixi.min.js', r => r.fulfill({ path }))`.
Headless Chromium falls back to software WebGL (~7 fps), and game time is capped per frame,
so the game runs ~3× slower than real time there; use generous timeouts.

## Conventions

- Keep games dependency-light and build-free (native ES modules, served as static files); pin CDN library versions.
- Mobile first: large tap targets, no hover-only UI, `touch-action: none` on the game.
- Child-friendly copy: short sentences, encouraging feedback.
