// The police car and the robber rigs on the road. Positions are plain numbers the game tweens;
// updateCars() puts the graphics there every frame (with bobbing, flashing lights and hint rings).
import { C, ROBBER_COLORS, pick } from '../config.js';
import { clock } from '../clock.js';
import { world } from '../app.js';
import { L } from '../state.js';
import { makePoliceCar, makeRobberRig } from '../assets/cars.js';
import { makeItem, layoutPile } from '../assets/loot.js';

export const police = { x: 0, y: 0, dy: 0, rot: 0, chasing: false, car: null };
export const robbers = [];   // { lane, spec, color, x, dy, rot, hint, rig, items, itemR }

function buildPolice() {
  if (police.car) police.car.c.destroy({ children: true });
  police.car = makePoliceCar(L.u);
  world.addChild(police.car.c);
}

function buildRig(r) {
  if (r.rig) r.rig.c.destroy({ children: true });
  r.rig = makeRobberRig(L.u, r.color);
  const { r: rad, pts } = layoutPile(r.spec, r.rig.inner);
  r.itemR = rad;
  r.items = pts.map(p => { const g = makeItem(r.spec.kind, rad); g.position.set(p.x, p.y); r.rig.loot.addChild(g); return g; });
  world.addChild(r.rig.c);
}

// One robber per lane, parked off-screen to the left until the game drives them in.
export function setRobbers(specs) {
  clearRobbers();
  const c0 = pick(ROBBER_COLORS), c1 = pick(ROBBER_COLORS.filter(c => c !== c0));
  specs.forEach((spec, lane) => {
    const r = { lane, spec, color: lane ? c1 : c0, x: -1.5 * L.u, dy: 0, rot: 0, hint: false };
    buildRig(r); robbers.push(r);
  });
}

export function clearRobbers() {
  robbers.forEach(r => r.rig.c.destroy({ children: true }));
  robbers.length = 0;
}

// Rebuild everything at the new size; parked cars snap to their spots.
export function layoutCars(snap) {
  buildPolice();
  robbers.forEach(r => buildRig(r));
  if (snap) { robbers.forEach(r => r.x = L.carX); Object.assign(police, { x: L.policeX, y: L.policeY }); }
}

export const homePolice = () => Object.assign(police, { x: L.policeX, y: L.policeY, dy: 0, rot: 0, chasing: false });

export function updateCars() {
  const t = clock.t, u = L.u, pc = police.car;
  pc.c.position.set(police.x, police.y + police.dy + Math.sin(t * 9) * .6);
  pc.c.rotation = police.rot; pc.c.zIndex = police.y;
  const on = Math.sin(t * Math.PI * (police.chasing ? 8 : 3)) > 0;
  pc.red.alpha = pc.glowR.alpha = on ? 1 : .3;
  pc.blue.alpha = pc.glowB.alpha = on ? .3 : 1;
  pc.glowR.visible = pc.glowB.visible = police.chasing;
  for (const r of robbers) {
    const y = L.lanes[r.lane];
    r.rig.c.position.set(r.x, y + r.dy + Math.sin(t * 8 + r.lane * 2) * .8);
    r.rig.c.rotation = r.rot; r.rig.c.zIndex = y;
    const h = r.rig.hint.clear();
    if (r.hint) {
      const b = r.rig.box, k = .5 + .5 * Math.sin(t * 6), pad = .12 * u + k * .08 * u;
      h.roundRect(b.x - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad, .25 * u).stroke({ width: .1 * u, color: C.yellow, alpha: .55 + .45 * k });
    }
  }
}
