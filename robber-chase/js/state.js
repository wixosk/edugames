// Shared mutable state. Objects are only ever mutated, never reassigned, so imports stay live.
import { LEVELS } from './levels.js';

export const settings = { level: LEVELS[0] };

// phase: idle | enter | choose | chase | caught | escape | compare | leave
export const S = { phase: 'idle', catches: 0, coins: 0, chase: null, answer: 0, lastPair: null, misses: 0 };

// Screen layout, filled by layout.js.
export const L = {};
