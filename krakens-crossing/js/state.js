// Shared mutable state. Objects are only ever mutated, never reassigned, so imports stay live.
import { LEVELS } from './levels.js';

export const settings = { level: LEVELS[0], timer: false };

// Round / problem / step progress. phase: idle | approach | halt | commit | explain | pass | between
export const S = { phase: 'idle', problems: [], pIndex: 0, prob: null, stepIdx: 0, step: null, sel: 0,
  locked: false, stepStart: 0, lastChange: 0, rt: 0, stars: 0, gateSpeed: 0, worldSpeed: 90, boost: 0,
  hintLane: null, hideVisual: false, forceVisual: false, tricky: [], requeued: new Set(), committedByGo: false,
  streak: 0, lastSurprise: null, eq: null };

// Screen layout (L) and ten-frame geometry (H), filled by layout.js.
export const L = {};
export const H = {};
