// Little wooden boat seen from above, with a white disc for the selected number. Nose points up at y = -50.
import { C } from '../config.js';

export function makeBoat() {
  const boat = new PIXI.Container();
  const wake = new PIXI.Graphics();
  wake.moveTo(-12, 30).lineTo(-26, 78).moveTo(12, 30).lineTo(26, 78).stroke({ width: 4, color: 0xffffff, alpha: .45, cap: 'round' });
  const hull = new PIXI.Graphics();
  hull.poly([0, -50, 22, -14, 20, 34, -20, 34, -22, -14]).fill(0x9c6644).stroke({ width: 3, color: 0x5e3b26 });
  hull.poly([0, -39, 14, -12, 13, 26, -13, 26, -14, -12]).fill(0xddb892);
  hull.circle(0, 4, 17).fill(0xffffff).stroke({ width: 3, color: C.navy });
  const label = new PIXI.Text({ text: '0', style: { fontFamily: 'system-ui', fontSize: 24, fontWeight: '900', fill: C.navy } });
  label.anchor.set(.5); label.y = 4;
  boat.addChild(wake, hull, label);
  return { boat, label };
}
