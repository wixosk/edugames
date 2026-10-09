// The player's boat: follows the selected lane, bobs, and carries effect offsets (BF) set by surprises.
import { clamp, lerpColor } from '../config.js';
import { clock } from '../clock.js';
import { S, L } from '../state.js';
import { makeBoat } from '../assets/boat.js';
import { laneX } from './numberline.js';

export const { boat, label: boatLabel } = makeBoat();
export const BF = { dy: 0, rot: 0, sc: 1, soot: 0, shakeT: 0 }; // offsets layered on top of steering

export const shake = d => BF.shakeT = d;
export const resetBoatFx = () => Object.assign(BF, { dy: 0, rot: 0, sc: 1, soot: 0, shakeT: 0 });
export const layoutBoat = () => { boat.y = L.boatY; };

export function updateBoat(dt) {
  const t = clock.t, tx = S.step ? laneX(S.sel) : L.W / 2;
  boat.x += (tx - boat.x) * Math.min(1, dt * 14);
  if (BF.shakeT > 0) { BF.shakeT -= dt; boat.x += Math.sin(t * 70) * 10 * BF.shakeT; }
  boat.y = L.boatY + Math.sin(t * 2.2) * 3 + BF.dy;
  boat.rotation = clamp((tx - boat.x) * .004, -.35, .35) + BF.rot;
  boat.scale.set(BF.sc);
  boat.tint = lerpColor(0xffffff, 0x2b2b2b, BF.soot);
  if (S.step) boatLabel.text = String(S.sel);
}
