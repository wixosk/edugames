// The kinds of question a problem is broken into. Each step asks for one number on a 0–10 or 10–20 line.
//   eq      – equation tokens: { t, c } is a number/sign (c = colour matching its dots), { q } is the yellow "?" box
//   visual  – ten-frame animations to play once the answer is shown: [kind, delaySeconds]
import { C } from './config.js';

const R = C.red, B = C.blue, Q = { q: true };

// 7 + ? = 10
export const bond = (a, b, { thenSplit = false } = {}) => ({
  kind: 'bond', eq: [{ t: a, c: R }, { t: '+' }, Q, { t: '=' }, { t: 10 }], answer: 10 - a, min: 0, max: 10,
  visual: thenSplit ? [['bond', 0], ['split', .7]] : [['bond', 0]],
});

// 5 = 3 + ?
export const split = (a, b) => ({
  kind: 'split', eq: [{ t: b, c: B }, { t: '=' }, { t: 10 - a, c: B }, { t: '+' }, Q], answer: b - (10 - a), min: 0, max: 10,
  visual: [['split', 0]],
});

// 10 + 2 = ?
export const total = (a, b) => {
  const r = b - (10 - a);
  return { kind: 'total', eq: [{ t: 10 }, { t: '+' }, { t: r, c: B }, { t: '=' }, Q], answer: 10 + r, min: 10, max: 20,
    visual: [['total', 0]] };
};

// 7 + 5 = ?
export const direct = (a, b) => ({
  kind: 'direct', eq: [{ t: a, c: R }, { t: '+' }, { t: b, c: B }, { t: '=' }, Q], answer: a + b, min: 10, max: 20,
  visual: [['bond', 0], ['split', .8]],
});
