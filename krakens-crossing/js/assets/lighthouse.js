// Striped lighthouse on a rock. Origin at the base; the lamp is at y = -85. `glow` is tinted by the crossing.
import { C } from '../config.js';

export const LAMP_Y = -85;

export function makeLighthouse() {
  const root = new PIXI.Container(), glow = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.ellipse(0, 4, 42, 16).fill(0x5c677d).ellipse(-6, 0, 30, 10).fill(0x7d8597);
  g.poly([-16, 0, 16, 0, 11, -72, -11, -72]).fill(0xffffff).stroke({ width: 2, color: 0x2b2d42, alpha: .4 });
  g.poly([-14.6, -20, 14.6, -20, 13.2, -38, -13.2, -38]).fill(C.red);
  g.poly([-12.5, -50, 12.5, -50, 11.6, -62, -11.6, -62]).fill(C.red);
  g.rect(-16, -77, 32, 6).fill(0x2b2d42);
  g.rect(-9, -92, 18, 15).fill(0xfff3b0).stroke({ width: 2, color: 0x2b2d42 });
  g.poly([-13, -92, 13, -92, 0, -106]).fill(C.red).stroke({ width: 2, color: 0x2b2d42 });
  glow.circle(0, LAMP_Y, 28).fill(0xffffff);
  root.addChild(glow, g);
  return { root, glow };
}
