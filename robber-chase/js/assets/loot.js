// Loot items and how a pile of them is laid out inside a trailer.
import { C, rnd } from '../config.js';

// One item centred on its origin. r is roughly its radius.
export function makeItem(kind, r) {
  const g = new PIXI.Graphics();
  if (kind === 'bar') {
    const w = r * 2, h = r * 1.15;
    g.poly([-w / 2, h / 2, w / 2, h / 2, w * .32, -h / 2, -w * .32, -h / 2]).fill(C.gold).stroke({ width: Math.max(2, r * .1), color: C.goldDark });
    g.poly([-w * .26, -h * .3, w * .1, -h * .3, w * .02, -h * .05, -w * .3, -h * .05]).fill({ color: 0xffffff, alpha: .55 });
  } else {
    g.circle(0, 0, r).fill(C.gold).stroke({ width: Math.max(1.5, r * .12), color: C.goldDark });
    g.circle(0, 0, r * .62).stroke({ width: Math.max(1, r * .1), color: C.goldDark, alpha: .6 });
    g.circle(-r * .32, -r * .32, r * .2).fill({ color: 0xffffff, alpha: .7 });
  }
  return g;
}

// Dice faces on a 3×3 grid (col, row in -1..1): easy to see at a glance.
const DICE = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
  7: [[-1, -1], [-1, 0], [-1, 1], [0, 0], [1, -1], [1, 0], [1, 1]],
  8: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
  9: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]],
};

// Item positions (trailer-local, centred) and item radius for a pile spec inside a box of inner.w × inner.h.
export function layoutPile(spec, inner) {
  const gx = inner.w / 3.2, gy = inner.h / 3;
  const base = Math.min(gx, gy) * .44;
  if (spec.layout === 'bunch') {
    // Tight clump in the middle, a little jumbled: small area on purpose.
    const r = base * spec.size, per = 3, d = r * 2.15, rows = Math.ceil(spec.n / per);
    const pts = [];
    for (let i = 0; i < spec.n; i++) {
      const row = Math.floor(i / per), inRow = Math.min(per, spec.n - row * per), col = i % per;
      pts.push({ x: (col - (inRow - 1) / 2) * d + rnd(-r * .12, r * .12), y: (row - (rows - 1) / 2) * d * .9 + rnd(-r * .12, r * .12) });
    }
    return { r, pts };
  }
  const r = base * spec.size * (spec.kind === 'bar' ? .9 : 1);
  return { r, pts: DICE[spec.n].map(([c, rw]) => ({ x: c * gx, y: rw * gy })) };
}
