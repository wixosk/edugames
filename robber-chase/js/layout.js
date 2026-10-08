// Screen geometry for the current window. Fills L (state.js), then relays out every view.
//   u      – layout unit (about a car's height); everything is sized in u
//   lanes  – road contact y of the back (0) and front (1) lane
import { app } from './app.js';
import { L } from './state.js';
import { RIG_BACK } from './assets/cars.js';
import { layoutStreet } from './view/street.js';
import { layoutHud } from './view/hud.js';
import { layoutCars } from './view/cars.js';
import { HUD_H } from './config.js';

export function layout(snap = false) {
  const W = app.screen.width, H = app.screen.height, m = Math.max(14, W * .025);
  // Two stacked rigs (2.6u tall each, lanes 2.75u apart) must fit under the HUD; the row must fit across.
  const u = Math.min((H - HUD_H) / 5.85, (W - 2 * m) / 9.8);
  const free = (H - HUD_H) - 5.85 * u;
  const front = H - .55 * u - free * .45, back = front - 2.75 * u;   // spare height (portrait) goes mostly to the sky
  const carX = W - m - 1.2 * u, rigLeft = carX - RIG_BACK * u;
  Object.assign(L, {
    W, H, u, lanes: [back, front],
    split: back + .1 * u,                       // taps above this pick the back lane
    roadTop: back - 1.7 * u, roadBot: front + .35 * u,
    carX, rigLeft,
    policeX: Math.max(1.4 * u + m, Math.min(W * .2, rigLeft - 2.6 * u)),
    policeY: (back + front) / 2,
    chaseX: rigLeft - 1.25 * u,                 // police nose just behind the trailer
  });
  layoutStreet();
  layoutHud();
  layoutCars(snap);
}
