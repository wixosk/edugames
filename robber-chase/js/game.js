// Round flow: robbers drive in → the child taps one → caught (coins fly to the chest) or it gets away
// and the two piles are compared coin by coin. ROUND_LEN catches end the round. There is no way to lose.
import { C, ROUND_LEN, pick, ease, easeOut } from './config.js';
import { clearTimers, later } from './clock.js';
import { save, persist } from './storage.js';
import { S, L, settings } from './state.js';
import { sfx } from './assets/sounds.js';
import { layout } from './layout.js';
import { anim, clearFx, comic, confetti, dust } from './fx.js';
import { police, robbers, setRobbers, clearRobbers, homePolice } from './view/cars.js';
import { resetHud, addCoin, fillSlot, chestTarget } from './view/hud.js';
import { runCompare, clearCompare } from './view/compare.js';
import { makeItem } from './assets/loot.js';
import { fxLayer } from './app.js';
import { show, showSummary } from './dom.js';

const easeIn = p => p * p;

// Tween the plain x/y numbers the car views read (y = null keeps it).
function moveTo(o, x, y, dur, fn = ease, done) {
  const x0 = o.x, y0 = o.y;
  anim(dur, p => { const k = fn(p); o.x = x0 + (x - x0) * k; if (y != null) o.y = y0 + (y - y0) * k; }, done);
}

export function startRound(level = settings.level) {
  settings.level = level;
  S.catches = 0; S.coins = 0; S.lastPair = null;
  clearTimers(); clearFx(); clearCompare(); clearRobbers();
  layout();
  resetHud();
  show('quit', true);
  homePolice(); police.x = -2 * L.u;
  nextChase();
}

function nextChase() {
  if (S.catches >= ROUND_LEN) return endRound();
  const lv = settings.level;
  let pair;
  do pair = pick(lv.pairs); while (lv.pairs.length > 1 && pair === S.lastPair);
  S.lastPair = pair;
  const ns = Math.random() < .5 ? [pair[1], pair[0]] : [...pair];
  S.answer = ns[0] > ns[1] ? 0 : 1;
  S.misses = 0;
  setRobbers(ns.map((n, i) => lv.loot(n, i === S.answer)));
  S.phase = 'enter';
  sfx.vroom();
  if (police.x < 0) { police.chasing = true; sfx.siren(2); moveTo(police, L.policeX, L.policeY, 1.3, easeOut, () => police.chasing = false); }
  robbers.forEach((r, i) => later(.2 + i * .35, () => { sfx.zoom(); moveTo(r, L.carX, null, 1.4, easeOut); }));
  later(2.1, () => S.phase = 'choose');
}

// Tap on a lane (input.js).
export function pickLane(lane) {
  if (S.phase !== 'choose') return;
  const r = robbers[lane];
  S.phase = 'chase';
  robbers.forEach(o => o.hint = false);
  police.chasing = true;
  sfx.siren(2); sfx.vroom();
  dust(police.x - L.u, police.y);
  moveTo(police, L.chaseX, L.lanes[lane], .9, ease, () => lane === S.answer ? caught(r) : escaped(r));
}

function caught(r) {
  S.phase = 'caught';
  const u = L.u, top = L.lanes[r.lane] - 2.8 * u;
  sfx.screech(); later(.15, sfx.caught);
  comic(pick(['Caught!', 'Gotcha!', 'Stop, robber!']), L.carX - 2 * u, top, C.mint);
  confetti(L.carX, top + u);
  // the driver hops out of the roof with hands up
  const hu = r.rig.handsUp, y0 = -.7 * u, y1 = -1.45 * u;
  r.rig.driver.visible = false; hu.visible = true;
  anim(.35, p => hu.y = y0 + (y1 - y0) * easeOut(p));
  // the other robber gives up its spot and drives off
  const other = robbers[1 - r.lane];
  later(.3, () => { sfx.zoom(); moveTo(other, L.W + 6 * u, null, 1.1, easeIn); });
  // every coin flies to the chest, one by one, with a rising note: count them!
  r.items.forEach((it, j) => later(.9 + j * .5, () => coinToChest(it, r.spec.kind, j)));
  later(.9 + r.items.length * .5 + .6, () => {
    S.catches++; save.caught++; persist();
    fillSlot(); sfx.pop();
    S.phase = 'leave';
    moveTo(r, L.W + 6 * u, null, 1.3, easeIn);
    later(.15, () => moveTo(police, L.W + 2 * u, null, 1.3, easeIn));
    later(1.6, () => { homePolice(); police.x = -2 * u; nextChase(); });
  });
}

function coinToChest(it, kind, j) {
  const p = it.getGlobalPosition(), g = makeItem(kind, 14);
  const s0 = it.width / g.width;
  it.visible = false;
  g.position.set(p.x, p.y); g.scale.set(s0); fxLayer.addChild(g);
  sfx.coin(j);
  const end = chestTarget(), x0 = p.x, y0 = p.y;
  anim(.6, k => {
    const e = ease(k);
    g.position.set(x0 + (end.x - x0) * e, y0 + (end.y - y0) * e - 80 * Math.sin(Math.PI * k));
    g.scale.set(s0 + (1 - s0) * e);
  }, () => { g.destroy(); addCoin(); S.coins++; save.coins++; });
}

function escaped(r) {
  S.phase = 'escape'; S.misses++;
  const u = L.u;
  sfx.boing();
  comic(pick(['Whoops!', 'Boing!', 'Too slow!']), L.carX - 2 * u, L.lanes[r.lane] - 2.8 * u, C.yellow);
  // the robber hops out of reach while the police car spins back to its spot
  anim(.7, p => { r.dy = -1.1 * u * Math.sin(Math.PI * p); r.rot = -.12 * Math.sin(Math.PI * p); }, () => { r.dy = 0; r.rot = 0; });
  police.chasing = false;
  anim(.9, p => police.rot = p * Math.PI * 2, () => police.rot = 0);
  moveTo(police, L.policeX, L.policeY, .9);
  later(1.3, () => {
    S.phase = 'compare';
    runCompare(robbers, S.answer, () => { robbers[S.answer].hint = true; S.phase = 'choose'; });
  });
}

function endRound() {
  S.phase = 'idle';
  clearRobbers(); homePolice();
  sfx.done();
  show('quit', false);
  showSummary(S.catches, S.coins);
}

export function toMenu() {
  S.phase = 'idle';
  clearTimers(); clearFx(); clearCompare(); clearRobbers(); homePolice();
  show('quit', false); show('summary', false); show('menu', true);
}

// How fast the street scrolls (u per second) in each phase.
export function streetSpeed() {
  return { chase: 7, leave: 8, enter: 5, caught: 1, escape: 2, compare: 0 }[S.phase] ?? 3;
}
