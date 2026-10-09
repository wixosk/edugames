// Number line along the bottom (min..max of the current step) plus faint lane guides across the sea.
import { C, clamp, txt } from '../config.js';
import { S, L } from '../state.js';

export const lanes = new PIXI.Graphics();          // goes in the sea layer
export const numberBar = new PIXI.Container();     // goes in the UI layer
const bg = new PIXI.Graphics(), line = new PIXI.Graphics();
const labels = Array.from({ length: 11 }, () => txt(26, 0xffffff, '800'));
numberBar.addChild(bg, line, ...labels);

export function laneX(v) { const { min, max } = S.step; return L.laneL + (v - min) / (max - min) * (L.laneR - L.laneL); }

// Lane value under screen x for the current step.
export function laneAt(x) {
  const { min, max } = S.step;
  return clamp(Math.round(min + (x - L.laneL) / (L.laneR - L.laneL) * (max - min)), min, max);
}

export function drawNumberLine() {
  if (!L.W) return;
  bg.clear().rect(0, L.seaBot, L.W, L.botH).fill(C.deep);
  line.clear(); lanes.clear();
  if (!S.step) { labels.forEach(t => t.visible = false); return; }
  const y = L.seaBot + L.botH * .34;
  const laneSpacing = (L.laneR - L.laneL) / (S.step.max - S.step.min);
  const labelSize = clamp(laneSpacing * .55, 11, 26);
  const selectedScale = Math.min(1.35, laneSpacing / (labelSize * 1.3));
  line.moveTo(L.laneL, y).lineTo(L.laneR, y).stroke({ width: 6, color: 0xffffff, alpha: .7, cap: 'round' });
  labels.forEach((t, k) => {
    const v = S.step.min + k, x = laneX(v);
    lanes.moveTo(x, L.seaTop).lineTo(x, L.seaBot).stroke({ width: 2, color: 0xffffff, alpha: v === S.sel ? .18 : .05 });
    line.moveTo(x, y - 10).lineTo(x, y + 10).stroke({ width: 4, color: 0xffffff, alpha: .8 });
    t.visible = true; t.text = String(v); t.position.set(x, y + 34);
    if (t.style.fontSize !== labelSize) t.style.fontSize = labelSize;
    t.style.fill = v === S.sel ? C.yellow : 0xffffff;
    t.scale.set(v === S.sel ? selectedScale : 1);
  });
  if (S.hintLane != null) line.circle(laneX(S.hintLane), y, 26).stroke({ width: 6, color: C.mint });
  line.circle(laneX(S.sel), y, 14).fill(C.yellow).stroke({ width: 3, color: C.navy });
}
