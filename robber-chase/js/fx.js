// Generic effects: tweens, particles and comic words.
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

export function dust(x, y, n = 8) {
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().circle(0, 0, rnd(6, 13)).fill({ color: 0xd9d9d9, alpha: .8 }), x + rnd(-10, 10), y + rnd(-8, 4),
      rnd(-160, -40), rnd(-60, -10), .7, { grav: -20, grow: 1.2 });
}

export function confetti(x, y, n = 32) {
  const cols = [C.yellow, C.mint, C.red, C.blue, 0xffffff, 0xf4a3c4];
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().rect(-4, -7, 8, 14).fill(cols[i % cols.length]), x, y, rnd(-320, 320), rnd(-560, -260), 1.5,
      { grav: 800, spin: rnd(-14, 14) });
}

export function sparkle(x, y, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    particle(new PIXI.Graphics().star(0, 0, 5, 7, 3).fill(0xfff3b0), x, y, Math.cos(a) * 160, Math.sin(a) * 160, .5, { grav: 0, spin: 6 });
  }
}

// Big outlined word that pops, floats up and fades.
export function comic(text, x, y, color = C.yellow, size = 1) {
  const fs = clamp(L.W * .06, 32, 64) * size;
  const tt = new PIXI.Text({ text, style: { fontFamily: 'system-ui', fontSize: fs, fontWeight: '900', fill: color,
    stroke: { color: C.navy, width: 8, join: 'round' } } });
  tt.anchor.set(.5); tt.rotation = rnd(-.12, .12);
  tt.position.set(clamp(x, tt.width / 2 + 10, L.W - tt.width / 2 - 10), y); fxLayer.addChild(tt);
  anim(1.3, p => {
    tt.scale.set(p < .15 ? p / .15 * 1.25 : p < .25 ? 1.25 - (p - .15) / .1 * .25 : 1);
    tt.alpha = p > .75 ? 1 - (p - .75) / .25 : 1; tt.y = y - p * 24;
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
