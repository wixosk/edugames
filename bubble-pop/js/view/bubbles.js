// The bubbles you can pop: they float up with a wobble, nudge each other apart, and are found by taps.
// A picked bubble (b.sel) stops rising so small fingers have time to find its partner.
import { world } from '../app.js';
import { L } from '../state.js';
import { clamp, rnd, pick } from '../config.js';
import { makeBubble, TINTS } from '../assets/bubble.js';

export const bubbles = [];

// Bubbles still in play (not merging or bursting).
export const live = () => bubbles.filter(b => !b.popping);

export function addBubble(n, x, y, vy) {
  const b = { n, x, y, vy, r: L.r, t: rnd(0, 6), wf: rnd(1.2, 2), sel: false, hint: false, popping: false, shake: 0,
    ...makeBubble(n, L.r, pick(TINTS)) };
  b.c.position.set(x, y);
  world.addChild(b.c); bubbles.push(b);
  return b;
}

export function dropBubble(b) {
  const i = bubbles.indexOf(b);
  if (i >= 0) bubbles.splice(i, 1);
  b.c.destroy({ children: true });
}

export function clearBubbles() { while (bubbles.length) dropBubble(bubbles[0]); }

// The bubble under a tap, with a generous margin; the closest one wins.
export function bubbleAt(x, y) {
  let best = null, bd = Infinity;
  for (const b of live()) {
    const d = Math.hypot(b.c.x - x, b.c.y - y);
    if (d < b.r * 1.3 && d < bd) { best = b; bd = d; }
  }
  return best;
}

// mul speeds the rise up over the round; onTop(b) is called for bubbles that reach the top bar.
export function updateBubbles(dt, mul, onTop) {
  const bs = live();
  for (const b of bs) {
    b.t += dt;
    if (!b.sel) b.y -= b.vy * mul * dt;
    b.shake = Math.max(0, b.shake - dt);
  }
  // soft push apart, mostly sideways; a picked bubble stays put and the others make room
  for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
    const a = bs[i], b = bs[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.r + b.r + 6;
    if (d >= min) continue;
    const ma = a.sel ? 0 : 1, mb = b.sel ? 0 : 1;
    if (!ma && !mb) continue;
    const push = (min - d) * .5 / (ma + mb), nx = dx / d, ny = dy / d;
    a.x -= nx * push * ma; b.x += nx * push * mb;
    a.y -= ny * push * ma * .3; b.y += ny * push * mb * .3;
  }
  for (const b of bs) {
    b.x = clamp(b.x, L.m + b.r, L.W - L.m - b.r);
    const wob = b.sel ? 0 : Math.sin(b.t * b.wf) * b.r * .12;
    const sh = b.shake > 0 ? Math.sin(b.t * 45) * b.r * .18 * (b.shake / .4) : 0;
    b.c.position.set(b.x + wob + sh, b.y);
    const s = b.sel ? 1.1 : b.hint ? 1.06 + .06 * Math.sin(b.t * 8) : 1, sq = Math.sin(b.t * 3.1) * .035;
    b.c.scale.set(s * (1 + sq), s * (1 - sq));
    b.ring.visible = b.sel;
    b.glow.visible = b.hint;
    if (b.hint) b.glow.alpha = .7 + .3 * Math.sin(b.t * 8);
    if (b.y < L.top + b.r * .4) onTop(b);
  }
}
