// Shared mutable state. Objects are only ever mutated, never reassigned, so imports stay live.
import { LEVELS } from './levels.js';

export const settings = { level: LEVELS[0] };

// phase: idle | ready | play | switch | over
//   sel      – the picked bubble waiting for its partner (or null), selT how long it has waited
//   combo    – pops in a row, each within COMBO_GAP seconds of the last
export const S = { phase: 'idle', score: 0, target: 10, timeLeft: 0, sel: null, selT: 0, combo: 0, lastPop: -99,
  popsHere: 0, spawnT: 0 };

// Screen layout, filled by layout.js.
export const L = {};
