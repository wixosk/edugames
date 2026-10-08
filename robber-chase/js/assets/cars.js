// Side-view cars, facing right. Origin is the road contact point under the car's centre; u is the layout unit.
//   police: white car with blue stripe and a flashing light bar
//   robber rig: coloured getaway car pulling an open trailer full of loot
import { C } from '../config.js';
import { drawRobberFace, makeHandsUp } from './robber.js';

export const CAR_HALF = 1.15;                       // half car length, in u
export const TRAILER = { w: 2.9, h: 2.05, gap: .3 }; // trailer box size and hitch gap, in u
export const RIG_BACK = CAR_HALF + TRAILER.gap + TRAILER.w; // rear of the trailer, behind the car centre

function body(g, u, color, line) {
  g.roundRect(-1.15 * u, -.9 * u, 2.3 * u, .65 * u, .22 * u).fill(color).stroke({ width: .05 * u, color: line });
  g.poly([-.62 * u, -.88 * u, -.36 * u, -1.36 * u, .42 * u, -1.36 * u, .74 * u, -.88 * u]).fill(color).stroke({ width: .05 * u, color: line });
}
function wheels(g, u, xs) {
  for (const x of xs) g.circle(x * u, -.26 * u, .27 * u).fill(0x222222).circle(x * u, -.26 * u, .12 * u).fill(0xbbbbbb);
}

export function makePoliceCar(u) {
  const c = new PIXI.Container(), g = new PIXI.Graphics();
  body(g, u, 0xffffff, C.navy);
  g.poly([-.47 * u, -.92 * u, -.29 * u, -1.26 * u, -.02 * u, -1.26 * u, -.02 * u, -.92 * u]).fill(C.glass);
  g.poly([.06 * u, -.92 * u, .06 * u, -1.26 * u, .37 * u, -1.26 * u, .6 * u, -.92 * u]).fill(C.glass);
  g.rect(-1.1 * u, -.66 * u, 2.2 * u, .17 * u).fill(C.blue);
  g.circle(1.07 * u, -.74 * u, .08 * u).fill(C.yellow);
  g.rect(-1.15 * u, -.78 * u, .1 * u, .14 * u).fill(C.red);
  // star badge on the door
  const sx = -.45 * u, sy = -.42 * u, pts = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? .07 : .16) * u; pts.push(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
  g.poly(pts).fill(C.gold).stroke({ width: 1.5, color: C.goldDark });
  wheels(g, u, [-.68, .68]);
  const red = new PIXI.Graphics().roundRect(-.32 * u, -1.52 * u, .3 * u, .17 * u, .06 * u).fill(0xff2d55);
  const blue = new PIXI.Graphics().roundRect(.02 * u, -1.52 * u, .3 * u, .17 * u, .06 * u).fill(0x2d7bff);
  const glowR = new PIXI.Graphics().circle(-.17 * u, -1.44 * u, .45 * u).fill({ color: 0xff2d55, alpha: .35 });
  const glowB = new PIXI.Graphics().circle(.17 * u, -1.44 * u, .45 * u).fill({ color: 0x2d7bff, alpha: .35 });
  c.addChild(glowR, glowB, g, red, blue);
  return { c, red, blue, glowR, glowB };
}

export function makeRobberRig(u, color) {
  const c = new PIXI.Container(), g = new PIXI.Graphics();
  const tr = TRAILER, back = -RIG_BACK * u, front = -(CAR_HALF + tr.gap) * u;
  // trailer: hitch, wheel, wooden box with a cream inside where the loot sits
  g.moveTo(front, -.5 * u).lineTo(-CAR_HALF * u, -.5 * u).stroke({ width: .1 * u, color: 0x333333 });
  g.roundRect(back, -(tr.h + .5) * u, tr.w * u, tr.h * u, .16 * u).fill(C.wood).stroke({ width: .06 * u, color: C.woodDark });
  const inset = .13 * u;
  g.roundRect(back + inset, -(tr.h + .5) * u + inset, tr.w * u - 2 * inset, tr.h * u - 2 * inset, .1 * u).fill(0xfff1d0);
  wheels(g, u, [(back + front) / 2 / u]);
  // getaway car
  body(g, u, color, 0x2b2d42);
  g.poly([-.47 * u, -.92 * u, -.29 * u, -1.26 * u, -.02 * u, -1.26 * u, -.02 * u, -.92 * u]).fill(0x5c677d);
  g.poly([.06 * u, -.92 * u, .06 * u, -1.26 * u, .37 * u, -1.26 * u, .6 * u, -.92 * u]).fill(0x5c677d);
  g.circle(1.07 * u, -.74 * u, .08 * u).fill(C.yellow);
  wheels(g, u, [-.68, .68]);
  const driver = drawRobberFace(new PIXI.Graphics(), .3 * u, -1.06 * u, .21 * u);
  const handsUp = makeHandsUp(u);
  handsUp.position.set(.1 * u, -1.3 * u); handsUp.visible = false;
  // loot lives in its own container centred in the trailer, so piles can be laid out in local coords
  const loot = new PIXI.Container();
  loot.position.set((back + front) / 2, -(tr.h / 2 + .5) * u);
  const inner = { w: tr.w * u - 2 * inset, h: tr.h * u - 2 * inset };
  const hint = new PIXI.Graphics();   // pulsing ring drawn around the trailer after a compare
  c.addChild(hint, handsUp, g, driver, loot);
  return { c, loot, inner, driver, handsUp, hint, box: { x: back, y: -(tr.h + .5) * u, w: tr.w * u, h: tr.h * u } };
}
