// Props for the "wrong answer" surprises.

// Barrel with a lit fuse.
export const makeBarrel = () => new PIXI.Graphics()
  .circle(0, 0, 20).fill(0x8b5a2b).stroke({ width: 3, color: 0x4a2c12 })
  .circle(0, 0, 12).stroke({ width: 3, color: 0x4a2c12 })
  .moveTo(0, -20).lineTo(6, -32).stroke({ width: 3, color: 0x222222 });

export function makeStormCloud() {
  const cloud = new PIXI.Graphics();
  for (const [x, y, r] of [[-30, 0, 22], [0, -12, 28], [30, 0, 22], [0, 8, 22]]) cloud.circle(x, y, r).fill(0x495057);
  return cloud;
}

// Zig-zag lightning bolt from (x, top) down to (x, bottom).
export function makeBolt(x, top, bottom) {
  const pts = [x, top];
  for (let k = 1; k <= 5; k++) pts.push(x + (k % 2 ? 18 : -14), top + k * 22);
  pts.push(x, bottom);
  return new PIXI.Graphics()
    .poly(pts, false).stroke({ width: 7, color: 0xfff3b0, join: 'miter' })
    .poly(pts, false).stroke({ width: 3, color: 0xffffff });
}

// Kraken tentacle curling round (cx, cy) from one side; `grow` 0..1 is how much of it is out, t wiggles it.
export function drawTentacle(g, cx, cy, side, grow, t, R = 62) {
  g.clear();
  const n = 22, a0 = side > 0 ? .7 : Math.PI - .7;
  for (let i = 0; i <= n * grow; i++) {
    const k = i / n, a = a0 - side * k * Math.PI * 1.35, rr = R * (1 - .25 * k) + Math.sin(t * 8 + k * 6) * 3;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr, r = 17 * (1 - k * .65);
    g.circle(x, y, r).fill(0x8a43b8);
    if (i % 3 === 1) g.circle(x, y, r * .4).fill(0xf1c6ff);
  }
}
