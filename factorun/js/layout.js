// Screen geometry for the current window and level. Fills L and H (state.js), then relays out every view.
import { clamp } from './config.js';
import { app } from './app.js';
import { L, H, settings } from './state.js';
import { layoutSea } from './view/sea.js';
import { layoutTopBar } from './view/topbar.js';
import { layoutTenFrames } from './view/tenframe.js';
import { drawNumberLine } from './view/numberline.js';
import { layoutBoat } from './view/boat.js';
import { layoutFx } from './fx.js';

export function layout() {
  const W = app.screen.width, Ht = app.screen.height;
  // Dots are the star of the top bar: centred, as big as fits beside the ✕ button.
  const two = settings.level.twoFrames, gapF = two ? 28 : 0, side = 64;
  const s = clamp(Math.min((W - 2 * side - gapF) / (two ? 10 : 5), Ht * .055), 18, 46);
  const blockW = two ? 10 * s + gapF : 5 * s;
  const ax = (W - blockW) / 2, fy = 16, py = fy + 2 * s + 12;
  Object.assign(H, { s, ax, bx: ax + 5 * s + gapF, fy, py });
  const dotsBottom = two ? py + s : fy + 2 * s;
  const eqSize = clamp(s * 1.45, 32, 64);
  const eqY = dotsBottom + 18 + eqSize * .6;
  const topH = eqY + eqSize * .6 + 16;
  const botH = clamp(Ht * .16, 100, 140);
  const reserve = W < 700 ? 116 : 168; // room for GO button
  Object.assign(L, { W, H: Ht, topH, botH, seaTop: topH, seaBot: Ht - botH, eqSize, eqY,
    laneL: Math.max(36, W * .05), laneR: W - reserve, boatY: Ht - botH - 64 });
  L.contactY = L.boatY - 62;   // beam line reaches the boat's nose
  L.stopY = L.boatY - Math.min(170, (L.boatY - L.seaTop) * .45); // where the kraken waits in no-timer mode

  layoutSea();
  layoutFx();
  layoutTopBar();
  layoutTenFrames(dotsBottom);
  layoutBoat();
  drawNumberLine();
}
