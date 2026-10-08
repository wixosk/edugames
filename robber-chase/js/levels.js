// Level definitions. The menu buttons are generated from this list, so adding a level here is enough.
//   pairs        – every [a, b] loot pair the level can ask (a ≠ b; which robber gets which is random)
//   loot(n, more) – how a pile of n looks: { n, kind: 'coin' | 'bar', size, layout: 'dice' | 'bunch' }
//                   `more` is true for the bigger pile, so a level can make looks misleading.

const pairsWhere = (lo, hi, okGap) => {
  const out = [];
  for (let a = lo; a <= hi; a++) for (let b = a + 1; b <= hi; b++) if (okGap(b - a)) out.push([a, b]);
  return out;
};

export const LEVELS = [
  {
    id: 1, icon: '🚓', title: 'Lots or little', blurb: 'Easy to see, like 1 and 5.', color: '#ffd166',
    pairs: pairsWhere(1, 6, gap => gap >= 3),
    loot: n => ({ n, kind: 'coin', size: 1, layout: 'dice' }),
  },
  {
    id: 2, icon: '🔍', title: 'Close call', blurb: 'Nearly the same, like 4 and 5. Count them!', color: '#06d6a0',
    pairs: pairsWhere(1, 6, gap => gap <= 2),
    loot: n => ({ n, kind: 'coin', size: 1, layout: 'dice' }),
  },
  {
    id: 3, icon: '🦹', title: 'Sneaky loot', blurb: 'Big gold bars or lots of tiny coins? Count, don\'t guess!', color: '#8ecae6',
    pairs: pairsWhere(2, 6, gap => gap <= 2),
    // The bigger pile is tiny coins bunched up; the smaller one is big bars spread out, so it *looks* like more.
    loot: (n, more) => more ? { n, kind: 'coin', size: .7, layout: 'bunch' } : { n, kind: 'bar', size: 1.25, layout: 'dice' },
  },
];
