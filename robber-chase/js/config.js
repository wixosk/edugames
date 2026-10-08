// Shared palette, tuning constants and tiny helpers.

export const C = { navy: 0x1d3557, cream: 0xfff8e7, yellow: 0xffd166, gold: 0xffc300, goldDark: 0xc98a00,
  mint: 0x06d6a0, red: 0xef476f, blue: 0x3a86ff, sky: 0x9bd4f5, road: 0x4a4e69, roadDark: 0x3a3d55,
  curb: 0xc9c9c9, wood: 0x9c6644, woodDark: 0x5e3b26, glass: 0xbde0fe };

// Each robber car gets its own colour so grown-ups can say "the purple one".
export const ROBBER_COLORS = [0x7b2cbf, 0xf3722c, 0x2a9d8f];

export const ROUND_LEN = 5;   // robbers to catch per round
export const HUD_H = 64;      // height of the top bar

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rnd = (a, b) => a + Math.random() * (b - a);
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const ease = p => p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
export const easeOut = p => 1 - (1 - p) ** 3;

// Bold rounded label used across the HUD.
export const txt = (size, fill, weight = '900') => {
  const t = new PIXI.Text({ text: '', style: { fontFamily: 'system-ui', fontSize: size, fontWeight: weight, fill } });
  t.anchor.set(.5); return t;
};
