// Ten-frame dot pictures in the top bar: red dots for a, blue for b (as a pile under the frames until they move in).
import { C, txt } from '../config.js';
import { clock, later } from '../clock.js';
import { S, L, H, settings } from '../state.js';

export const hud = new PIXI.Container();
const frameG = new PIXI.Graphics(), qG = new PIXI.Graphics(), dotLayer = new PIXI.Container();
hud.addChild(frameG, qG, dotLayer);

export const noHint = txt(26, C.navy, '800');
noHint.text = '💪 No dots this time!'; noHint.alpha = 0;

let dots = [];

// slot: { where: 'A' | 'B', i: 0..9 } in a frame, or { where: 'pile', i } in the row below.
export function slotXY(slot) {
  const { s, ax, bx, fy, py } = H;
  if (slot.where === 'pile') return { x: ax + slot.i * s + s / 2, y: py + s / 2 };
  const ox = slot.where === 'A' ? ax : bx;
  return { x: ox + (slot.i % 5) * s + s / 2, y: fy + Math.floor(slot.i / 5) * s + s / 2 };
}

export function layoutTenFrames(dotsBottom) {
  const { s, ax, bx, fy } = H;
  frameG.clear();
  for (const ox of settings.level.twoFrames ? [ax, bx] : [ax]) {
    frameG.roundRect(ox - 4, fy - 4, 5 * s + 8, 2 * s + 8, 10).fill({ color: C.navy, alpha: .1 });
    for (let i = 0; i < 10; i++)
      frameG.roundRect(ox + (i % 5) * s + 2, fy + Math.floor(i / 5) * s + 2, s - 4, s - 4, 6)
        .fill(0xffffff).stroke({ width: 2, color: C.navy, alpha: .35 });
  }
  noHint.position.set(L.W / 2, (fy + dotsBottom) / 2);
  for (const d of dots) { const p = slotXY(d.slot); d.g.position.set(p.x, p.y); }
}

function addDot(color, slot, pop = false) {
  const g = new PIXI.Graphics();
  g.circle(0, 0, H.s * .36).fill(color).stroke({ width: 2, color: 0x000000, alpha: .2 });
  const p = slotXY(slot); g.position.set(p.x, p.y);
  if (pop) g.scale.set(0);
  dotLayer.addChild(g);
  dots.push({ g, slot });
}

export function setupDots({ a, b }) {
  dotLayer.removeChildren().forEach(c => c.destroy());
  dots = [];
  for (let i = 0; i < a; i++) addDot(C.red, { where: 'A', i });
  if (settings.level.twoFrames) for (let j = 0; j < b; j++) addDot(C.blue, { where: 'pile', i: j });
}

const pile = () => dots.filter(d => d.slot.where === 'pile');

const animations = {
  // Fill frame A up to ten: pop in new blue dots, or slide them up from the pile.
  bond() {
    const { a } = S.prob, fill = 10 - a;
    if (!settings.level.twoFrames) for (let j = 0; j < fill; j++) later(j * .08, () => addDot(C.blue, { where: 'A', i: a + j }, true));
    else pile().slice(0, fill).forEach((d, j) => later(j * .1, () => d.slot = { where: 'A', i: a + j }));
  },
  // What's left of the pile moves into frame B.
  split() { pile().forEach((d, j) => later(j * .1, () => d.slot = { where: 'B', i: j })); },
  // Every dot pops.
  total() { dots.forEach(d => d.g.scale.set(1.35)); },
};

// Play a step's visual timeline: [[kind, delaySeconds], ...].
export function playVisual(timeline) {
  for (const [kind, delay] of timeline) delay ? later(delay, animations[kind]) : animations[kind]();
}

// Slots the yellow "?" is asking about, pulsed while the kid is thinking.
function qTargets() {
  if (!S.step || !(S.phase === 'approach' || S.phase === 'halt')) return [];
  const a = S.prob.a;
  if (S.step.kind === 'bond') return Array.from({ length: 10 - a }, (_, j) => slotXY({ where: 'A', i: a + j }));
  if (S.step.kind === 'split') return pile().map(d => slotXY(d.slot));
  return [];
}

export function updateTenFrames(dt) {
  const hideDots = S.hideVisual && !S.forceVisual;
  hud.alpha += ((hideDots ? 0 : 1) - hud.alpha) * Math.min(1, dt * 6);
  noHint.alpha = S.step && hideDots ? 1 - hud.alpha : 0;
  qG.clear();
  const pulse = .5 + .5 * Math.sin(clock.t * 5);
  for (const p of qTargets())
    qG.circle(p.x, p.y, H.s * .44).fill({ color: C.yellow, alpha: .25 + .35 * pulse }).stroke({ width: 3, color: 0xf4a100, alpha: .6 + .4 * pulse });
  for (const d of dots) {
    const p = slotXY(d.slot);
    d.g.x += (p.x - d.g.x) * Math.min(1, dt * 9);
    d.g.y += (p.y - d.g.y) * Math.min(1, dt * 9);
    d.g.scale.set(d.g.scale.x + (1 - d.g.scale.x) * Math.min(1, dt * 8));
  }
}
