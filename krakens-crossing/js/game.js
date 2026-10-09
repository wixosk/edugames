// Round flow: round → problems → steps. Each step is one crossing the boat has to steer through.
import { C, ROUND_LEN, now, pick } from './config.js';
import { clearTimers, later } from './clock.js';
import { save, persist } from './storage.js';
import { S, L, settings } from './state.js';
import { pickRound, isMastered, recordFact } from './practice.js';
import { sfx } from './assets/sounds.js';
import { layout } from './layout.js';
import { anim, clearFx } from './fx.js';
import { celebrate, wrongAnswer } from './surprises.js';
import { boat, BF, resetBoatFx } from './view/boat.js';
import { gate, resetGate, drawCrossing } from './view/crossing.js';
import { drawNumberLine } from './view/numberline.js';
import { setEquation, drawStars } from './view/topbar.js';
import { setupDots, playVisual } from './view/tenframe.js';
import { show, goBtn, showSummary, setPlaying } from './dom.js';

const thinking = () => S.phase === 'approach' || S.phase === 'halt';

export function startRound(level = settings.level) {
  setPlaying(true);
  settings.level = level;
  S.problems = pickRound(level, ROUND_LEN);
  S.pIndex = 0; S.stars = 0; S.streak = 0; S.tricky = []; S.requeued = new Set();
  clearTimers(); clearFx(); resetBoatFx();
  drawStars();
  layout();
  show('go', true); show('quit', true);
  startProblem();
}

function startProblem() {
  if (S.pIndex >= S.problems.length) return endRound();
  const p = S.problems[S.pIndex];
  S.prob = { ...p, steps: settings.level.steps(p.a, p.b), wrong: false, rts: [] };
  S.hideVisual = settings.level.noDots || isMastered(p.key);
  S.forceVisual = false;
  setupDots(p);
  S.stepIdx = 0;
  startStep();
}

function startStep() {
  const st = S.step = S.prob.steps[S.stepIdx];
  S.sel = st.min; S.locked = false; S.hintLane = null; S.committedByGo = false;
  setEquation(st.eq);
  S.stepStart = S.lastChange = now();
  // One hint rock on a random wrong number, only while the fact still needs help.
  const wrongs = [];
  for (let v = st.min; v <= st.max; v++) if (v !== st.answer) wrongs.push(v);
  resetGate(S.hideVisual ? null : pick(wrongs));
  const target = settings.timer ? L.contactY : L.stopY;
  S.gateSpeed = (target - gate.y) / (settings.timer ? save.approachT : 3.5);
  S.phase = 'approach';
  goBtn.disabled = false;
  drawNumberLine();
}

// Steer to lane v (from input).
export function select(v) {
  if (S.locked || !S.step || !thinking() || v === S.sel) return;
  S.sel = v; S.lastChange = now(); sfx.tick(); drawNumberLine();
}

// Lock in the answer: by GO, or by the crossing reaching the boat in timer mode.
export function commit(byGo) {
  if (S.locked || !thinking()) return;
  S.locked = true; S.committedByGo = byGo;
  S.rt = ((byGo ? now() : S.lastChange) - S.stepStart) / 1000;
  goBtn.disabled = true;
  S.phase = 'commit';
}

function resolve() {
  const st = S.step, ok = S.sel === st.answer;
  S.prob.rts.push(S.rt);
  const bx = boat.x, by = L.boatY;
  if (ok) {
    S.stars++; S.streak++; drawStars();
    setEquation(st.eq, { value: st.answer, color: C.green });
    celebrate(bx, by);
    playVisual(st.visual);
    if (settings.timer && S.rt < save.approachT * .6) save.approachT = Math.max(3.5, save.approachT * .93);
    S.boost = 380;
    S.phase = 'pass';
  } else {
    S.streak = 0;
    S.prob.wrong = true;
    gate.beam = 'lose';
    if (settings.timer) save.approachT = Math.min(10, save.approachT * 1.15);
    S.phase = 'explain';
    wrongAnswer(bx, by);
    later(1.1, sfx.wahwah);
    // ...then the calm "let's do it together" explanation.
    later(1.7, () => {
      anim(1, p => BF.soot = 1 - p);
      gate.beam = 'idle';
      S.forceVisual = true; S.hintLane = st.answer;
      setEquation(st.eq, { value: st.answer, color: C.orange });
      drawNumberLine();
      playVisual(st.visual);
    });
    later(3.6, () => { S.sel = st.answer; drawNumberLine(); });
    later(4.2, () => { S.boost = 260; S.phase = 'pass'; });
  }
  persist();
}

function nextStep() {
  S.stepIdx++;
  if (S.stepIdx < S.prob.steps.length) return startStep();
  // problem finished
  const p = S.prob;
  recordFact(p.key, p.wrong, p.rts);
  if (p.wrong) {
    S.tricky.push(`${p.a} + ${p.b}`);
    if (!S.requeued.has(p.key)) { S.requeued.add(p.key); S.problems.push({ a: p.a, b: p.b, key: p.key }); }
  }
  persist();
  const done = settings.level.doneEq(p.a, p.b);
  setEquation(done.parts, done.reveal);
  S.step = null; drawNumberLine();
  S.phase = 'between';
  later(1.6, () => { S.pIndex++; startProblem(); });
}

function endRound() {
  S.phase = 'idle'; gate.active = false; drawCrossing(); clearFx(); resetBoatFx();
  sfx.done();
  show('go', false); show('quit', false);
  showSummary(S.stars, [...new Set(S.tricky)]); setPlaying(false);
}

export function toMenu() {
  S.phase = 'idle'; clearTimers(); gate.active = false; drawCrossing(); clearFx(); resetBoatFx();
  S.step = null; drawNumberLine();
  setEquation(null);
  show('go', false); show('quit', false); show('summary', false); show('menu', true); setPlaying(false);
}

// Per-frame phase logic: move the crossing and set how fast the sea scrolls.
export function updateGame(dt) {
  switch (S.phase) {
    case 'approach':
      gate.y += S.gateSpeed * dt; S.worldSpeed = S.gateSpeed;
      if (settings.timer && gate.y >= L.contactY) { gate.y = L.contactY; commit(false); }
      else if (!settings.timer && gate.y >= L.stopY) { gate.y = L.stopY; S.phase = 'halt'; }
      break;
    case 'halt': S.worldSpeed = 15; break;
    case 'commit':
      gate.y += 650 * dt; S.worldSpeed = 650;
      if (gate.y >= L.contactY) { gate.y = L.contactY; resolve(); }
      break;
    case 'explain': S.worldSpeed = 0; break;
    case 'pass':
      S.worldSpeed = S.boost;
      gate.y += S.boost * dt;
      if (gate.y > L.seaBot + 140) { gate.active = false; S.phase = 'between'; later(.3, nextStep); }
      break;
    default: S.worldSpeed = 90;
  }
  drawCrossing();
}
