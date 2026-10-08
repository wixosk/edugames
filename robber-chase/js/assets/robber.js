// The robber character: masked face with a striped beanie, and a full "hands up!" pose.
import { C } from '../config.js';

const SKIN = 0xf4c095;

// Face centred on (x, y) with radius r.
export function drawRobberFace(g, x, y, r) {
  g.circle(x, y, r).fill(SKIN).stroke({ width: Math.max(1.5, r * .1), color: C.navy });
  // beanie
  g.moveTo(x - r * 1.02, y - r * .2).arc(x, y - r * .2, r * 1.02, Math.PI, 0).closePath().fill(0x2b2d42);
  g.rect(x - r * 1.05, y - r * .38, r * 2.1, r * .26).fill(C.red);
  g.circle(x, y - r * 1.25, r * .22).fill(C.red);
  // mask with eyes
  g.roundRect(x - r * .95, y - r * .05, r * 1.9, r * .42, r * .2).fill(0x111111);
  g.circle(x - r * .38, y + r * .16, r * .14).fill(0xffffff).circle(x + r * .38, y + r * .16, r * .14).fill(0xffffff);
  g.circle(x - r * .35, y + r * .17, r * .06).fill(0x111111).circle(x + r * .41, y + r * .17, r * .06).fill(0x111111);
  // little "oops" mouth
  g.ellipse(x, y + r * .62, r * .16, r * .12).fill(0x8d2b2b);
  return g;
}

// Robber popping out of the roof with both hands up. Origin at the waist; u is the layout unit.
export function makeHandsUp(u) {
  const g = new PIXI.Graphics();
  const bw = u * .62, bh = u * .5;
  for (const s of [-1, 1]) {
    g.moveTo(s * bw * .4, -bh * .8).lineTo(s * bw * .95, -bh * 2.1).stroke({ width: u * .13, color: SKIN, cap: 'round' });
    g.circle(s * bw * .97, -bh * 2.2, u * .11).fill(0xffffff).stroke({ width: 2, color: C.navy });
  }
  g.roundRect(-bw / 2, -bh, bw, bh, u * .1).fill(0xffffff).stroke({ width: 2, color: C.navy });
  for (let i = 1; i < 4; i++) g.rect(-bw / 2, -bh + i * bh / 4 - bh / 16, bw, bh / 8).fill(0x111111);
  drawRobberFace(g, 0, -bh - u * .3, u * .32);
  return g;
}
