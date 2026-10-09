// Top bar: pearl counter (pairs popped), the target sign and the time bar.
// The sign doubles as the helper: "Make 10" turns into "3 + ? = 10" while a bubble is picked, with a small
// ten-frame hanging under it, and briefly shows "3 + 7 = 10" (or "3 + 5 = 8") after a pair is tried.
import { C, HUD_H, ROUND_SEC, clamp, txt } from '../config.js';
import { L, S } from '../state.js';
import { makePearl } from '../assets/bubble.js';
import { anim } from '../fx.js';

export const hud = new PIXI.Container();
const band = new PIXI.Graphics(), timeBar = new PIXI.Graphics();
const counter = new PIXI.Container(), counterBg = new PIXI.Graphics(), pearl = makePearl(13), countText = txt(26, 0xffffff);
counter.addChild(counterBg, pearl, countText);
const sign = new PIXI.Container(), signBg = new PIXI.Graphics(), signText = txt(30, C.navy);
sign.addChild(signBg, signText);
const frame = new PIXI.Graphics();
frame.alpha = 0;
hud.addChild(band, timeBar, counter, frame, sign);

let count = 0, msg = null, hold = 0, frameOn = false;

function drawCounter() {
  countText.text = String(count);
  const w = 50 + countText.width + 16;
  counterBg.clear().roundRect(0, 0, w, 46, 23).fill({ color: 0x000000, alpha: .28 });
  pearl.position.set(25, 23); countText.position.set(44 + countText.width / 2, 24);
}

// The sign shows the helper message if there is one, else the target.
function drawSign() {
  signText.text = msg ? msg.text : `Make ${S.target}`;
  // fit between the pearl counter and the ✕ button
  const room = L.W - 2 * Math.max(counter.x + counterBg.width + 10, 70);
  signText.style.fontSize = clamp(L.W * .07, 22, 34);
  if (signText.width + 36 > room) signText.style.fontSize *= room / (signText.width + 36);
  const w = signText.width + 36, h = HUD_H - 16;
  signBg.clear().roundRect(-w / 2, -h / 2, w, h, h / 2).fill(msg ? msg.bg : C.yellow).stroke({ width: 4, color: 0xffffff });
}

export function layoutHud() {
  band.clear().rect(0, 0, L.W, HUD_H).fill({ color: C.navy, alpha: .35 });
  counter.position.set(12, 9);
  drawCounter();
  sign.position.set(L.W / 2, HUD_H / 2 - 2);
  drawSign();
  frame.position.set(L.W / 2, HUD_H + 4);
}

export function resetHud() { count = 0; msg = null; hold = 0; frameOn = false; frame.alpha = 0; layoutHud(); }

export const counterTarget = () => ({ x: counter.x + 25, y: counter.y + 23 });

const bump = (obj, k = .3) => anim(.3, p => obj.scale.set(1 + k * Math.sin(Math.PI * p)));

export function addPearl() { count++; drawCounter(); bump(pearl, .5); }

export function setTarget() { msg = null; drawSign(); bump(sign, .35); }

// Show a helper message on the sign. cells: one colour per square of a T-cell frame (null = empty),
// or null for no frame. secs > 0 puts the target back after that long; 0 keeps it until hideHelper().
export function showHelper(text, cells = null, bg = C.cream, secs = 0) {
  msg = { text, bg }; hold = secs;
  drawSign(); bump(sign, .12);
  frame.clear(); frameOn = !!cells;
  if (!cells) return;
  const cs = clamp(L.W * .03, 13, 20), gap = 3, pad = 6, rows = Math.ceil(cells.length / 5);
  const fw = 5 * cs + 4 * gap, fh = rows * cs + (rows - 1) * gap;
  frame.roundRect(-fw / 2 - pad, 0, fw + 2 * pad, fh + 2 * pad, 10).fill({ color: C.navy, alpha: .55 });
  cells.forEach((col, i) => {
    const x = -fw / 2 + (i % 5) * (cs + gap), y = pad + Math.floor(i / 5) * (cs + gap);
    frame.roundRect(x, y, cs, cs, 4).fill({ color: 0xffffff, alpha: .15 }).stroke({ width: 1.5, color: 0xffffff, alpha: .6 });
    if (col != null) frame.circle(x + cs / 2, y + cs / 2, cs * .36).fill(col);
  });
}

export function hideHelper() { if (msg) { msg = null; drawSign(); } frameOn = false; hold = 0; }

export function updateHud(dt) {
  hud.visible = S.phase !== 'idle';
  if (hold > 0 && (hold -= dt) <= 0) hideHelper();
  frame.alpha = clamp(frame.alpha + (frameOn ? 6 : -4) * dt, 0, 1);
  const k = clamp(S.timeLeft / ROUND_SEC, 0, 1), low = S.timeLeft <= 10;
  timeBar.clear().rect(0, HUD_H - 6, L.W, 6).fill({ color: 0x000000, alpha: .25 })
    .rect(0, HUD_H - 6, L.W * k, 6).fill(low ? C.red : C.mint);
}
