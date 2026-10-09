// Level definitions. The menu buttons are generated from this list, so adding a level here is enough.
//   facts()     – every {a, b} problem the level can ask
//   key(a, b)   – id for the fact in saved progress (don't change existing keys: progress is stored under them)
//   steps(a, b) – the questions a problem is split into (see steps.js)
//   doneEq      – the full equation shown once a problem is finished
//   twoFrames   – top bar shows a second ten-frame, with b as a pile of blue dots underneath
//   noDots      – dot pictures start hidden (they still appear after a mistake)
import { C } from './config.js';
import { bond, split, total, direct } from './steps.js';

const bonds = () => [1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => ({ a, b: 10 - a }));
const bridges = () => {
  const out = [];
  for (let a = 2; a <= 9; a++) for (let b = 2; b <= 9; b++) if (a + b > 10) out.push({ a, b });
  return out;
};
const bridgeKey = (a, b) => `add:${a}+${b}`;
const bridgeDone = (a, b) => ({
  parts: [{ t: a, c: C.red }, { t: '+' }, { t: b, c: C.blue }, { t: '=' }, { q: true }], reveal: { value: a + b, color: C.green },
});

export const LEVELS = [
  {
    id: 1, title: 'Make 10', blurb: '7 + ? = 10. Pairs that make ten.', color: '#ffd166',
    facts: bonds, key: a => `bond:${a}`,
    steps: (a, b) => [bond(a, b)],
    doneEq: (a, b) => ({ parts: [{ t: a, c: C.red }, { t: '+' }, { t: b, c: C.blue }, { t: '=' }, { t: 10, c: C.green }] }),
    twoFrames: false, noDots: false,
  },
  {
    id: 2, title: 'Over the 10', blurb: "7 + 5 in three steps: fill the ten, what's left, add.", color: '#06d6a0',
    facts: bridges, key: bridgeKey,
    steps: (a, b) => [bond(a, b), split(a, b), total(a, b)],
    doneEq: bridgeDone, twoFrames: true, noDots: false,
  },
  {
    id: 3, title: 'Big jumps', blurb: '7 + 5 in two steps: fill the ten, then the answer.', color: '#8ecae6',
    facts: bridges, key: bridgeKey,
    steps: (a, b) => [bond(a, b, { thenSplit: true }), total(a, b)],
    doneEq: bridgeDone, twoFrames: true, noDots: false,
  },
  {
    id: 4, title: 'Speedy sums', blurb: '7 + 5 = ? in one go. Help shows up only if needed.', color: '#f4a3c4',
    facts: bridges, key: bridgeKey,
    steps: (a, b) => [direct(a, b)],
    doneEq: bridgeDone, twoFrames: true, noDots: true,
  },
];

export const getLevel = id => LEVELS.find(l => l.id === id) ?? LEVELS[0];
