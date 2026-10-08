# edugames

Small educational browser games for kids. Each game lives in its own folder as a
self-contained `index.html` (inline CSS + JS, no build step).

## Games

- `factorun/` — **Kraken Crossing**: steer a boat along a number line to answer
  addition facts (make-10 bonds, bridging over 10). Uses PixiJS 8 from jsDelivr,
  Web Audio for sound, `speechSynthesis` for voice, and `localStorage` for progress.
  Touch-first: designed for phones/tablets in landscape or portrait.

## Running

No dependencies beyond Python 3:

```bash
cd factorun && python3 -m http.server 8765 --bind 0.0.0.0
# open http://localhost:8765
```

`factorun/.claude/launch.json` holds the same config for the Claude preview pane.

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
