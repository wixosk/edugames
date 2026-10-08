// The street: sky, a scrolling strip of buildings, the two-lane road and the sidewalk.
import { C, rnd } from '../config.js';
import { L } from '../state.js';
import { makeBuilding } from '../assets/city.js';

export const street = new PIXI.Container();
const sky = new PIXI.Graphics(), sun = new PIXI.Graphics(), town = new PIXI.Container(), road = new PIXI.Graphics(), dashes = new PIXI.Graphics();
street.addChild(sky, sun, town, road, dashes);

let blds = [], stripW = 0, off = 0;

export function layoutStreet() {
  const { W, H, u, roadTop, roadBot } = L;
  sky.clear().rect(0, 0, W, H).fill(C.sky);
  sun.clear();
  if (roadTop > 3 * u) sun.circle(W * .62, roadTop * .4, u * .7).fill(0xffe066);
  town.removeChildren().forEach(c => c.destroy());
  blds = [];
  const maxH = Math.max(u * 1.2, Math.min(roadTop * .8, u * 5));
  let x = 0;
  while (x < W + 3 * u) {
    const w = rnd(1.4, 2.4) * u, b = makeBuilding(w, rnd(.45, 1) * maxH);
    b.position.set(x, roadTop - .1 * u); town.addChild(b); blds.push({ b, w });
    x += w + rnd(.1, .5) * u;
  }
  stripW = x;
  road.clear()
    .rect(0, roadTop - .22 * u, W, .22 * u).fill(0xb8b8b8)
    .rect(0, roadTop, W, roadBot - roadTop).fill(C.road)
    .rect(0, roadTop, W, .08 * u).fill(C.curb)
    .rect(0, roadBot, W, H - roadBot).fill(0x8d99ae)
    .rect(0, roadBot, W, .1 * u).fill(C.curb);
}

// speed is in u per second; buildings scroll slower for a bit of depth.
export function updateStreet(dt, speed) {
  const { W, u, lanes } = L, v = speed * u * dt, step = 1.6 * u;
  for (const o of blds) { o.b.x -= v * .35; if (o.b.x + o.w < 0) o.b.x += stripW; }
  off = (off + v) % step;
  const y = lanes[0] + .5 * u;
  dashes.clear();
  for (let x = -off; x < W; x += step) dashes.rect(x, y - .05 * u, .8 * u, .1 * u).fill({ color: 0xffffff, alpha: .8 });
}
