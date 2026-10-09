// Screen geometry for the current window. Fills L (state.js), then relays out every view.
//   r     – bubble radius   m – side margin   top – bubbles burst here   floor – top of the sand
import { app } from './app.js';
import { L } from './state.js';
import { HUD_H, clamp } from './config.js';
import { layoutSea } from './view/sea.js';
import { layoutHud } from './view/hud.js';
import { bubbles } from './view/bubbles.js';

export function layout() {
  const W = app.screen.width, H = app.screen.height;
  // on rotate/resize, keep floating bubbles at the same relative spot instead of piling up at an edge
  if (L.W) for (const b of bubbles) { b.x *= W / L.W; b.y = HUD_H + (b.y - HUD_H) * (H - HUD_H) / (L.H - HUD_H); }
  Object.assign(L, {
    W, H, m: Math.max(10, W * .02), top: HUD_H,
    r: clamp(Math.sqrt(W * H) * .06, 32, 62),
    floor: H - clamp(H * .07, 24, 50),
  });
  layoutSea();
  layoutHud();
}
