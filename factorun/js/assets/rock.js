// Grey rock with a ring of surf, drawn into `g` at (sx, sy) with size u.
export function drawRock(g, u, sx = 0, sy = 0) {
  g.ellipse(sx, sy + u * .18, u * .62, u * .3).fill({ color: 0xffffff, alpha: .55 });
  g.poly([sx - u * .5, sy + u * .15, sx - u * .32, sy - u * .3, sx - u * .05, sy - u * .5, sx + u * .22, sy - u * .36, sx + u * .5, sy + u * .12])
    .fill(0x6c757d).stroke({ width: 3, color: 0x343a40 });
  g.poly([sx - u * .05, sy - u * .5, sx + u * .22, sy - u * .36, sx + u * .05, sy - u * .1]).fill(0x9aa1a8);
  return g;
}
