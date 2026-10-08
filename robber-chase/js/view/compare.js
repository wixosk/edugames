// "Let's look together": after a wrong pick, both piles fly out of the trailers into two rows,
// matched coin by coin. Matching pairs get joined one at a time, then the extra coins light up.
import { C, clamp, ease } from '../config.js';
import { clock, later } from '../clock.js';
import { L } from '../state.js';
import { anim, sparkle } from '../fx.js';
import { makeItem } from '../assets/loot.js';
import { drawRobberFace } from '../assets/robber.js';
import { sfx } from '../assets/sounds.js';

export const comparePanel = new PIXI.Container();
let pulses = [], pulseT0 = 0;   // { g, base, delay }: heartbeat-scaled while the panel is open

export function clearCompare() {
  comparePanel.removeChildren().forEach(c => c.destroy({ children: true }));
  pulses = [];
}

function tween(obj, x, y, s, dur, done) {
  const x0 = obj.x, y0 = obj.y, s0 = obj.scale.x;
  anim(dur, p => { const k = ease(p); obj.position.set(x0 + (x - x0) * k, y0 + (y - y0) * k - 40 * Math.sin(Math.PI * p)); obj.scale.set(s0 + (s - s0) * k); }, done);
}

export function runCompare(robbers, answer, done) {
  clearCompare();
  const { W, H } = L, maxN = Math.max(...robbers.map(r => r.spec.n)), minN = Math.min(...robbers.map(r => r.spec.n));
  const pw = Math.min(W - 24, 860), badge = clamp(pw * .13, 54, 96);
  const cell = Math.min((pw - badge - 48) / maxN, H * .2, 96), rowH = cell * 1.15;
  const ph = rowH * 2 + 48, px = (W - pw) / 2, py = (H - ph) / 2;
  const dim = new PIXI.Graphics().rect(0, 0, W, H).fill({ color: 0x0d1b34, alpha: .55 });
  const panel = new PIXI.Graphics().roundRect(px, py, pw, ph, 28).fill(C.cream).stroke({ width: 4, color: C.navy, alpha: .2 });
  const badges = new PIXI.Container(), lines = new PIXI.Graphics(), glows = new PIXI.Container(), items = new PIXI.Container();
  comparePanel.addChild(dim, panel, badges, lines, glows, items);
  comparePanel.alpha = 0;
  anim(.3, p => comparePanel.alpha = p);

  const rowY = i => py + 24 + rowH / 2 + i * rowH;
  const colX = j => px + 24 + badge + 12 + cell * (j + .5);
  const flown = [];
  robbers.forEach((r, i) => {
    // badge: the robber's car colour with their face, so each row says whose loot it is
    const b = new PIXI.Graphics().circle(0, 0, badge * .42).fill(r.color).stroke({ width: 4, color: C.navy });
    drawRobberFace(b, 0, badge * .04, badge * .26);
    b.position.set(px + 24 + badge / 2, rowY(i)); badges.addChild(b);
    if (i === answer) pulses.push({ g: b, base: 1, delay: .9 + minN * .5 });
    const target = (r.spec.kind === 'bar' ? cell * .4 : cell * .36) / r.itemR;
    flown[i] = r.items.map((it, j) => {
      const g = makeItem(r.spec.kind, r.itemR), p = it.getGlobalPosition();
      g.position.set(p.x, p.y); items.addChild(g);
      later(.1 + i * .15 + j * .05, () => { it.visible = false; tween(g, colX(j), rowY(i), target, .6); });
      return { g, it, home: p, target };
    });
  });

  // One-to-one: join each pair with a line and a counting note.
  const t0 = 1.1;
  for (let k = 0; k < minN; k++) later(t0 + k * .5, () => {
    sfx.pair(k);
    lines.moveTo(colX(k), rowY(0) + cell * .3).lineTo(colX(k), rowY(1) - cell * .3).stroke({ width: 5, color: C.mint, cap: 'round' });
    for (const row of flown) { const o = row[k]; anim(.25, p => o.g.scale.set(o.target * (1 + .3 * Math.sin(Math.PI * p)))); }
  });
  // The extra coins have no partner: light them up.
  const t1 = t0 + minN * .5 + .2, more = flown[answer];
  for (let k = minN; k < maxN; k++) later(t1 + (k - minN) * .4, () => {
    sfx.extra();
    const x = colX(k), y = rowY(answer);
    glows.addChild(new PIXI.Graphics().circle(x, y, cell * .48).fill({ color: C.yellow, alpha: .7 }));
    sparkle(x, y);
    pulses.push({ g: more[k].g, base: more[k].target, delay: 0 });
  });

  // Back into the trailers, then hand control back.
  const t2 = t1 + (maxN - minN) * .4 + 1.8;
  later(t2, () => {
    pulses = [];
    flown.flat().forEach((o, n) => later(n * .03, () => tween(o.g, o.home.x, o.home.y, 1, .5)));
    anim(.4, p => { lines.alpha = glows.alpha = badges.alpha = panel.alpha = dim.alpha = 1 - p; });
  });
  later(t2 + .5 + flown.flat().length * .03 + .1, () => {
    flown.flat().forEach(o => o.it.visible = true);
    clearCompare(); comparePanel.alpha = 1;
    done();
  });
  pulseT0 = clock.t;
}

export function updateCompare() {
  const t = clock.t;
  for (const p of pulses) if (t - pulseT0 > p.delay) p.g.scale.set(p.base * (1 + .12 * Math.sin(t * 8)));
}
