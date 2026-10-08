// Background buildings: a coloured block with rows of windows. Origin at the bottom-left corner.
const COLORS = [0xe07a5f, 0xf2cc8f, 0x81b29a, 0xa8dadc, 0xcdb4db, 0xf4a261];

export function makeBuilding(w, h, color = COLORS[Math.floor(Math.random() * COLORS.length)]) {
  const g = new PIXI.Graphics();
  g.rect(0, -h, w, h).fill(color).rect(0, -h, w, h * .06).fill({ color: 0x000000, alpha: .12 });
  const ww = w * .18, wh = Math.min(h * .12, ww * 1.3), cols = 3, rows = Math.max(1, Math.floor((h * .8) / (wh * 1.8)));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    g.rect(w * (.14 + c * .27), -h + h * .14 + r * wh * 1.8, ww, wh).fill({ color: 0xfff8e7, alpha: Math.random() < .3 ? .95 : .55 });
  return g;
}
