// Generic effects: tweens, particles, splashes and comic words.
import { C, clamp, rnd } from './config.js';
import { fxLayer } from './app.js';
import { L } from './state.js';

let parts = [], anims = [];

// Call fn(progress 0..1) every frame for dur seconds, then done().
export function anim(dur, fn, done) { anims.push({ t: 0, dur, fn, done }); }

// Move a display object to (x, y) over dur seconds with an optional hop.
export function fly(obj, x, y, dur, { hop = 0, ease = p => p, done } = {}) {
  const x0 = obj.x, y0 = obj.y;
  anim(dur, p => { const k = ease(p); obj.position.set(x0 + (x - x0) * k, y0 + (y - y0) * k - hop * Math.sin(Math.PI * p)); }, done);
}

function particle(g, x, y, vx, vy, life, opt = {}) {
  g.position.set(x, y); fxLayer.addChild(g);
  parts.push({ g, vx, vy, life, max: life, grav: opt.grav ?? 700, grow: opt.grow ?? 0, spin: opt.spin ?? 0 });
}

export function clearFx() {
  anims = []; parts = [];
  fxLayer.removeChildren().forEach(c => c.destroy({ children: true }));
}

// A bubble bursting: an expanding rim and a spray of droplets.
export function splash(x, y, r, color = 0xffffff, n = 10) {
  const ring = new PIXI.Graphics().circle(0, 0, r).stroke({ width: Math.max(2, r * .1), color: 0xffffff });
  ring.position.set(x, y); fxLayer.addChild(ring);
  anim(.3, p => { ring.scale.set(1 + p * .7); ring.alpha = 1 - p; }, () => ring.destroy());
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd(-.2, .2), v = rnd(140, 280);
    particle(new PIXI.Graphics().circle(0, 0, rnd(2.5, 5.5)).fill({ color, alpha: .95 }),
      x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, Math.cos(a) * v, Math.sin(a) * v, .45, { grav: 350 });
  }
}

export function confetti(x, y, n = 32) {
  const cols = [C.yellow, C.mint, C.red, C.blue, 0xffffff, C.pink];
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().rect(-4, -7, 8, 14).fill(cols[i % cols.length]), x, y, rnd(-320, 320), rnd(-560, -260), 1.5,
      { grav: 800, spin: rnd(-14, 14) });
}

export function sparkle(x, y, n = 8, dist = 160) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    particle(new PIXI.Graphics().star(0, 0, 5, 7, 3).fill(0xfff3b0), x, y, Math.cos(a) * dist, Math.sin(a) * dist, .5, { grav: 0, spin: 6 });
  }
}

// Big outlined word that pops, floats up and fades.
export function comic(text, x, y, color = C.yellow, size = 1) {
  const fs = clamp(L.W * .06, 30, 60) * size;
  const tt = new PIXI.Text({ text, style: { fontFamily: 'system-ui', fontSize: fs, fontWeight: '900', fill: color,
    stroke: { color: C.navy, width: 8, join: 'round' } } });
  tt.anchor.set(.5); tt.rotation = rnd(-.1, .1);
  tt.position.set(clamp(x, tt.width / 2 + 10, L.W - tt.width / 2 - 10), clamp(y, L.top + tt.height / 2, L.H - tt.height / 2));
  const y0 = tt.y; fxLayer.addChild(tt);
  anim(1.1, p => {
    tt.scale.set(p < .15 ? p / .15 * 1.25 : p < .25 ? 1.25 - (p - .15) / .1 * .25 : 1);
    tt.alpha = p > .7 ? 1 - (p - .7) / .3 : 1; tt.y = y0 - p * 30;
  }, () => tt.destroy());
}

export function updateFx(dt) {
  for (const a of anims) { a.t += dt; a.fn(Math.min(1, a.t / a.dur)); }
  const fin = anims.filter(a => a.t >= a.dur);
  anims = anims.filter(a => a.t < a.dur);
  fin.forEach(a => a.done && a.done());
  for (const p of parts) {
    p.life -= dt; p.vy += p.grav * dt; p.g.x += p.vx * dt; p.g.y += p.vy * dt;
    p.g.rotation += p.spin * dt; if (p.grow) p.g.scale.set(p.g.scale.x + p.grow * dt);
    p.g.alpha = Math.min(1, p.life / p.max * 2);
  }
  parts.filter(p => p.life <= 0).forEach(p => p.g.destroy());
  parts = parts.filter(p => p.life > 0);
}
