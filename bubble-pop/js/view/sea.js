// The lagoon behind the bubbles: water gradient, swaying light rays, fish silhouettes, seaweed, sand
// and tiny background fizz. Nothing here can be tapped.
import { C, rnd, pick } from '../config.js';
import { L } from '../state.js';

export const sea = new PIXI.Container();
const water = new PIXI.Graphics(), rays = new PIXI.Graphics(), fishes = new PIXI.Container(),
  fizz = new PIXI.Graphics(), weeds = new PIXI.Graphics(), sand = new PIXI.Graphics();
sea.addChild(water, rays, fishes, fizz, weeds, sand);

let weedList = [], fishList = [], fizzList = [], t = 0;

const mix = (a, b, k) => {
  const ch = s => (a >> s & 255) + ((b >> s & 255) - (a >> s & 255)) * k;
  return (Math.round(ch(16)) << 16) | (Math.round(ch(8)) << 8) | Math.round(ch(0));
};

function makeFish(s) {
  return new PIXI.Graphics()
    .ellipse(0, 0, s, s * .5).fill(0x0b2545)
    .poly([s * .8, 0, s * 1.5, -s * .45, s * 1.5, s * .45]).fill(0x0b2545)
    .circle(-s * .5, -s * .1, s * .09).fill({ color: 0xffffff, alpha: .6 });
}

export function layoutSea() {
  const { W, H, floor } = L, bands = 32;
  water.clear();
  for (let i = 0; i < bands; i++) water.rect(0, H * i / bands, W, H / bands + 1).fill(mix(C.waterTop, C.waterBot, i / (bands - 1)));
  rays.clear();
  for (let i = 0; i < 5; i++) {
    const x = W * (.1 + i * .2) + rnd(-30, 30), w = rnd(30, 70);
    rays.poly([x, 0, x + w, 0, x + w * 2.5 - W * .15, floor, x + w * .5 - W * .15, floor]).fill({ color: 0xffffff, alpha: .06 });
  }
  // wavy sand along the bottom, with a few darker pebbles
  sand.clear().moveTo(0, H);
  for (let x = 0; x <= W + 20; x += 20) sand.lineTo(x, floor + Math.sin(x / 70) * 6);
  sand.lineTo(W, H).closePath().fill(C.sand);
  for (let i = 0; i < W / 40; i++) sand.ellipse(rnd(0, W), rnd(floor + 12, H - 4), rnd(3, 8), rnd(2, 4)).fill(C.sandDark);
  weedList = [];
  for (let x = rnd(10, 60); x < W; x += rnd(70, 180))
    weedList.push({ x, h: rnd(.12, .3) * H, w: rnd(6, 11), ph: rnd(0, 6), color: pick([0x2a9d8f, 0x52b788, 0x40916c]) });
  fishes.removeChildren().forEach(c => c.destroy());
  fishList = [];
  for (let i = 0; i < 3; i++) {
    const g = makeFish(rnd(14, 26)); g.alpha = rnd(.15, .28);
    const dir = Math.random() < .5 ? 1 : -1;
    g.scale.x = -dir;   // the fish art faces left
    g.position.set(rnd(0, W), rnd(L.top + 40, floor - 60));
    fishes.addChild(g); fishList.push({ g, v: dir * rnd(18, 40) });
  }
  fizzList = Array.from({ length: 18 }, () => ({ x: rnd(0, W), y: rnd(L.top, H), r: rnd(1.5, 4), v: rnd(20, 50) }));
}

export function updateSea(dt) {
  const { W, H, floor } = L;
  t += dt;
  rays.alpha = .75 + .25 * Math.sin(t * .7);
  for (const f of fishList) {
    f.g.x += f.v * dt; f.g.y += Math.sin(t + f.g.x * .01) * .15;
    if (f.v > 0 && f.g.x > W + 60) f.g.x = -60;
    if (f.v < 0 && f.g.x < -60) f.g.x = W + 60;
  }
  fizz.clear();
  for (const b of fizzList) {
    b.y -= b.v * dt; if (b.y < L.top) { b.y = H; b.x = rnd(0, W); }
    fizz.circle(b.x + Math.sin(t * 2 + b.y * .05) * 3, b.y, b.r).stroke({ width: 1.2, color: 0xffffff, alpha: .35 });
  }
  weeds.clear();
  for (const w of weedList) {
    const sway = Math.sin(t * 1.3 + w.ph) * w.h * .12, y0 = floor + 8;
    weeds.moveTo(w.x, y0).quadraticCurveTo(w.x - sway, y0 - w.h * .55, w.x + sway, y0 - w.h)
      .stroke({ width: w.w, color: w.color, cap: 'round' });
  }
}
