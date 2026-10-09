// Generic effects: tweens, particles, comic words and a full-screen flash.
import { C, clamp, rnd } from './config.js';
import { L } from './state.js';
import { sfx } from './assets/sounds.js';

export const fxLayer = new PIXI.Container();   // in the world, above the boat
export const flash = new PIXI.Graphics();      // top of the UI layer
flash.alpha = 0;

let parts = [], anims = [];

// Call fn(progress 0..1) every frame for dur seconds, then done().
export function anim(dur, fn, done) { anims.push({ t: 0, dur, fn, done }); }

function particle(g, x, y, vx, vy, life, opt = {}) {
  g.position.set(x, y); fxLayer.addChild(g);
  parts.push({ g, vx, vy, life, max: life, grav: opt.grav ?? 700, grow: opt.grow ?? 0, spin: opt.spin ?? 0 });
}

export function clearFx() {
  anims = []; parts = [];
  fxLayer.removeChildren().forEach(c => c.destroy({ children: true }));
}

export const layoutFx = () => flash.clear().rect(0, 0, L.W, L.H).fill(0xffffff);
export function flashScreen(tint, alpha) { flash.tint = tint; flash.alpha = alpha; }

export function splash(x, y, n = 18) {
  sfx.splash();
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().circle(0, 0, rnd(3, 8)).fill(0xffffff), x + rnd(-20, 20), y, rnd(-200, 200), rnd(-420, -180), .9, { grav: 950 });
}

export function smoke(x, y, n = 8) {
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().circle(0, 0, rnd(10, 18)).fill({ color: 0x444444, alpha: .7 }), x + rnd(-25, 25), y + rnd(-10, 10),
      rnd(-40, 40), rnd(-90, -40), 1.6, { grav: -10, grow: .9 });
}

export function fireball(x, y, n = 20) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2), v = rnd(150, 380);
    particle(new PIXI.Graphics().circle(0, 0, rnd(6, 14)).fill(i % 2 ? 0xffb703 : 0xfb5607), x, y,
      Math.cos(a) * v, Math.sin(a) * v, .5, { grav: 0, grow: 1.2 });
  }
}

export function confetti(x, y, n = 32) {
  const cols = [C.yellow, C.mint, C.red, C.blue, 0xffffff, 0xf4a3c4];
  for (let i = 0; i < n; i++)
    particle(new PIXI.Graphics().rect(-4, -7, 8, 14).fill(cols[i % cols.length]), x, y, rnd(-320, 320), rnd(-560, -260), 1.5,
      { grav: 800, spin: rnd(-14, 14) });
}

// Big outlined word that pops, floats up and fades.
export function comic(text, x, y, color = C.yellow, size = 1) {
  const fs = clamp(L.W * .06, 34, 64) * size;
  const tt = new PIXI.Text({ text, style: { fontFamily: 'system-ui', fontSize: fs, fontWeight: '900', fill: color,
    stroke: { color: C.navy, width: 8, join: 'round' } } });
  tt.anchor.set(.5); tt.rotation = rnd(-.15, .15);
  const cx = clamp(x, tt.width / 2 + 10, L.W - tt.width / 2 - 10);
  tt.position.set(cx, y); fxLayer.addChild(tt);
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
  flash.alpha = Math.max(0, flash.alpha - dt * 2.5);
}
