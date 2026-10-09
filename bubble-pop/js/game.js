// Round flow: bubbles float up for ROUND_SEC seconds. Tap one, then its partner: if they make the target
// they merge and burst into a pearl; if not, they wobble and show what they do make. Bubbles that reach
// the top just pop. There is no way to lose: the score is how many pairs you popped.
import { C, ROUND_SEC, COMBO_GAP, HINT_AFTER, pick, rnd, rndInt, ease, easeIn, easeOut } from './config.js';
import { clock, clearTimers, later } from './clock.js';
import { save, persist } from './storage.js';
import { S, L, settings } from './state.js';
import { sfx } from './assets/sounds.js';
import { makeBubble, makePearl } from './assets/bubble.js';
import { layout } from './layout.js';
import { anim, fly, clearFx, comic, confetti, sparkle, splash } from './fx.js';
import { bubbles, live, addBubble, dropBubble, clearBubbles, bubbleAt, updateBubbles } from './view/bubbles.js';
import { resetHud, addPearl, setTarget, counterTarget, showHelper, hideHelper } from './view/hud.js';
import { fxLayer } from './app.js';
import { show, showSummary, setPlaying, refreshBests } from './dom.js';

// Bubbles rise a bit faster as the minute runs out.
const speedMul = () => 1 + .35 * (1 - S.timeLeft / ROUND_SEC);

export function startRound(level = settings.level) {
  settings.level = level;
  Object.assign(S, { score: 0, combo: 0, lastPop: -99, sel: null, selT: 0, popsHere: 0, spawnT: 0,
    timeLeft: ROUND_SEC, target: pick(level.targets) });
  clearTimers(); clearFx(); clearBubbles();
  layout(); resetHud();
  show('quit', true); setPlaying(true);
  S.phase = 'ready';
  seed();
  sfx.go();
  comic(`Make ${S.target}!`, L.W / 2, L.H * .45, C.yellow, 1.2);
  later(1.2, () => { if (S.phase === 'ready') S.phase = 'play'; });
}

// A couple of pairs already on their way up, so there's something to pop straight away.
function seed() {
  const span = L.floor - L.top;
  for (let i = 0; i < 2; i++) {
    const a = rndInt(1, S.target - 1);
    spawn(a, L.floor - span * (.15 + .3 * i));
    spawn(S.target - a, L.floor - span * (.2 + .3 * i));
  }
}

// New bubbles mostly bring a partner for one already floating (the lowest lonely one, so there's time
// to reach it); the rest are random. If nothing on screen makes a pair, a partner is guaranteed.
function nextNumber() {
  const T = S.target, bs = live();
  const hasPartner = b => bs.some(o => o !== b && o.n + b.n === T);
  const lonely = bs.filter(b => !hasPartner(b)).sort((a, b) => b.y - a.y);
  if (lonely.length && (lonely.length === bs.length || Math.random() < settings.level.partner)) return T - lonely[0].n;
  return rndInt(1, T - 1);
}

// Spawn below the screen (or at y) where there's the most room among the low bubbles.
function spawn(n = nextNumber(), y = L.H + L.r) {
  const near = live().filter(b => Math.abs(b.y - y) < 4 * L.r);
  let best = L.W / 2, bestD = -1;
  for (let k = 0; k < 8; k++) {
    const x = rnd(L.m + L.r, L.W - L.m - L.r);
    const d = Math.min(Infinity, ...near.map(b => Math.hypot(b.x - x, b.y - y)));
    if (d > bestD) { best = x; bestD = d; }
  }
  addBubble(n, best, y, (L.floor - L.top) / settings.level.rise * rnd(.85, 1.15));
}

export function updateGame(dt) {
  if (S.phase === 'idle') return;
  updateBubbles(dt, speedMul(), escape);
  if (S.sel && (S.selT += dt) > HINT_AFTER) hint();
  if (S.phase !== 'play') return;
  const before = Math.ceil(S.timeLeft);
  S.timeLeft = Math.max(0, S.timeLeft - dt);
  if (S.timeLeft > 0 && S.timeLeft <= 5 && Math.ceil(S.timeLeft) < before) sfx.tick();
  if (S.timeLeft <= 0) return endRound();
  const lv = settings.level;
  if ((S.spawnT -= dt) <= 0) {
    if (live().length < lv.maxOn) spawn();
    S.spawnT = lv.rise / lv.maxOn * .8 / speedMul();
  }
}

// The picked bubble has waited a while: make its nearest partner glow.
function hint() {
  const a = S.sel, ps = live().filter(b => b !== a && b.n + a.n === S.target);
  if (!ps.length || ps.some(b => b.hint)) return;
  ps.sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y))[0].hint = true;
}

function escape(b) {
  if (b === S.sel) { unpick(); hideHelper(); }
  burst(b, .8);
}

function burst(b, size = 1) {
  splash(b.c.x, b.c.y, b.r * size, 0xffffff, 6); sfx.plip(); dropBubble(b);
}

// Pop every bubble on screen in a quick ripple (target switch, end of round).
function popAll(delay = 0) {
  live().forEach((b, i) => { b.popping = true; later(delay + i * .06, () => burst(b)); });
}

// Tap on the sea (input.js).
export function tapAt(x, y) {
  if (S.phase !== 'play' && S.phase !== 'ready') return;
  const b = bubbleAt(x, y);
  if (!b) return;
  if (!S.sel) return pickBubble(b);
  if (b === S.sel) { unpick(); hideHelper(); sfx.unpick(); return; }
  const a = S.sel;
  unpick();
  if (a.n + b.n === S.target) match(a, b); else mismatch(a, b);
}

// Ten-frame cells for the helper: runs of [count, colour], padded with empties up to the target.
function cells(...runs) {
  if (!settings.level.frame || S.target > 10) return null;
  const out = [];
  for (const [n, col] of runs) for (let i = 0; i < n; i++) out.push(col);
  while (out.length < S.target) out.push(null);
  return out.slice(0, S.target);
}

function pickBubble(b) {
  S.sel = b; S.selT = 0; b.sel = true;
  sfx.pick();
  showHelper(`${b.n} + ? = ${S.target}`, cells([b.n, C.yellow]));
}

function unpick() {
  if (S.sel) S.sel.sel = false;
  S.sel = null;
  bubbles.forEach(o => o.hint = false);
}

function match(a, b) {
  const T = S.target, mx = (a.c.x + b.c.x) / 2, my = (a.c.y + b.c.y) / 2;
  a.popping = b.popping = true;
  S.score++; save.pairs++; persist();
  S.combo = clock.t - S.lastPop < COMBO_GAP ? S.combo + 1 : 1;
  S.lastPop = clock.t;
  const combo = S.combo;
  showHelper(`${a.n} + ${b.n} = ${T}`, cells([a.n, C.yellow], [b.n, C.mint]), C.mint, 1.2);
  sfx.join();
  // the two bubbles rush together, become one big bubble showing the target, and burst
  fly(a.c, mx, my, .18, { ease: easeIn });
  fly(b.c, mx, my, .18, { ease: easeIn, done: () => {
    dropBubble(a); dropBubble(b);
    const big = makeBubble(T, L.r * 1.25, C.yellow);
    big.c.position.set(mx, my); fxLayer.addChild(big.c);
    anim(.22, p => big.c.scale.set(.75 + .45 * easeOut(p)), () => {
      big.c.destroy({ children: true });
      splash(mx, my, L.r * 1.5, C.yellow, 14); sparkle(mx, my, 8, 220);
      sfx.pop(combo - 1);
      if (combo >= 3) comic(`Combo ×${combo}!`, mx, my - L.r * 1.7, C.pink, .9);
      if (combo % 5 === 0) confetti(mx, my);
      pearlToCounter(mx, my);
    });
  } });
  if (settings.level.targets.length > 1 && ++S.popsHere >= settings.level.every) later(.6, switchTarget);
}

function pearlToCounter(x, y) {
  const p = makePearl(10), end = counterTarget();
  p.position.set(x, y); fxLayer.addChild(p);
  fly(p, end.x, end.y, .6, { hop: 70, ease, done: () => { p.destroy(); addPearl(); sfx.pearl(); } });
}

function mismatch(a, b) {
  const sum = a.n + b.n;
  S.combo = 0;
  a.shake = b.shake = .4;
  sfx.boing();
  showHelper(`${a.n} + ${b.n} = ${sum}`, null, C.pink, 1.6);
  comic(sum > S.target ? 'Too big!' : 'Too small!', (a.c.x + b.c.x) / 2, Math.min(a.c.y, b.c.y) - L.r * 1.5, C.yellow, .8);
}

// Mixed-target levels: clear the bubbles, flip the sign, start again (the clock waits meanwhile).
function switchTarget() {
  if (S.phase !== 'play') return;
  S.phase = 'switch'; S.popsHere = 0;
  unpick(); hideHelper();
  S.target = pick(settings.level.targets.filter(t => t !== S.target));
  sfx.whoosh();
  popAll();
  later(.6, () => {
    setTarget(); sfx.go();
    comic(`Now make ${S.target}!`, L.W / 2, L.H * .45, C.yellow, 1.1);
    seed();
  });
  later(1.7, () => { if (S.phase === 'switch') S.phase = 'play'; });
}

function endRound() {
  S.phase = 'over';
  unpick(); hideHelper();
  sfx.done();
  comic("Time's up!", L.W / 2, L.H * .45, C.yellow, 1.2);
  popAll(.3);
  const id = settings.level.id, isBest = S.score > (save.best[id] || 0);
  if (isBest) save.best[id] = S.score;
  save.rounds++; persist();
  later(1.8, () => {
    S.phase = 'idle';
    show('quit', false); setPlaying(false); refreshBests();
    showSummary(S.score, settings.level.targets.length === 1 ? S.target : 0, isBest);
  });
}

export function toMenu() {
  S.phase = 'idle'; S.sel = null;
  clearTimers(); clearFx(); clearBubbles(); hideHelper();
  show('quit', false); show('summary', false); show('menu', true); setPlaying(false);
  refreshBests();
}
