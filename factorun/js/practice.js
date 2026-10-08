// Picks which facts to ask (weighted towards the tricky ones) and records how each fact went.
import { save } from './storage.js';
import { MASTERED_STREAK, QUICK_SECONDS } from './config.js';

function weight(key) {
  const s = save.stats[key];
  if (!s) return 3;
  return 1 + 5 * (s.wrong / Math.max(1, s.seen)) + (s.streak < MASTERED_STREAK ? 1.5 : 0);
}

// n problems for the level, never the same fact twice in a row.
export function pickRound(level, n) {
  const c = level.facts().map(p => ({ ...p, key: level.key(p.a, p.b) }));
  const out = [];
  let last = null;
  while (out.length < n) {
    const ws = c.map(p => p.key === last ? 0 : weight(p.key));
    let r = Math.random() * ws.reduce((x, y) => x + y, 0), i = 0;
    while (r > ws[i]) r -= ws[i++];
    out.push(c[i]); last = c[i].key;
  }
  return out;
}

export const isMastered = key => (save.stats[key]?.streak ?? 0) >= MASTERED_STREAK;

// wrong: any step missed; rts: seconds taken per step.
export function recordFact(key, wrong, rts) {
  const s = save.stats[key] ||= { seen: 0, wrong: 0, streak: 0 };
  s.seen++;
  if (wrong) { s.wrong++; s.streak = 0; }
  else if (Math.max(...rts) < QUICK_SECONDS) s.streak++;
}
