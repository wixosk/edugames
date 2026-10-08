// Cream top bar: the equation (coloured tokens so each number matches its dots) and the star counter.
import { C, txt } from '../config.js';
import { S, L } from '../state.js';

export const topBg = new PIXI.Graphics();
export const eqLayer = new PIXI.Container();
export const starPill = new PIXI.Container();
const starBg = new PIXI.Graphics(), starText = txt(26, 0xffffff);
starPill.addChild(starBg, starText);

export function layoutTopBar() {
  topBg.clear().rect(0, 0, L.W, L.topH).fill(C.cream).rect(0, L.topH - 4, L.W, 4).fill({ color: C.navy, alpha: .15 });
  starPill.position.set(14, L.seaTop + 12);
  if (S.eq) setEquation(S.eq.parts, S.eq.reveal);
}

// parts: tokens from steps.js; reveal: { value, color } fills the "?" box with the answer.
export function setEquation(parts, reveal = null) {
  eqLayer.removeChildren().forEach(c => c.destroy({ children: true }));
  S.eq = parts ? { parts, reveal } : null;
  if (!parts) return;
  const size = L.eqSize, gap = size * .22;
  const style = fill => ({ fontFamily: 'system-ui', fontSize: size, fontWeight: '900', fill });
  const items = parts.map(p => {
    if (p.q) {
      const c = new PIXI.Container();
      const t = new PIXI.Text({ text: reveal ? String(reveal.value) : '?', style: style(reveal ? 0xffffff : C.navy) });
      t.anchor.set(.5);
      const w = Math.max(size * 1.15, t.width + size * .45), h = size * 1.2;
      const g = new PIXI.Graphics().roundRect(-w / 2, -h / 2, w, h, size * .25)
        .fill(reveal ? reveal.color : C.yellow).stroke({ width: 4, color: C.navy });
      c.addChild(g, t); c.w = w; return c;
    }
    const t = new PIXI.Text({ text: String(p.t), style: style(p.c ?? C.navy) });
    t.anchor.set(.5); t.w = t.width; return t;
  });
  const total = items.reduce((sum, it) => sum + it.w, 0) + gap * (items.length - 1);
  let x = L.W / 2 - total / 2;
  for (const it of items) { it.position.set(x + it.w / 2, L.eqY); x += it.w + gap; eqLayer.addChild(it); }
}

export function drawStars() {
  starText.text = `⭐ ${S.stars}`;
  const w = starText.width + 28;
  starBg.clear().roundRect(0, 0, w, 44, 22).fill({ color: 0x000000, alpha: .25 });
  starText.position.set(w / 2, 23);
}
