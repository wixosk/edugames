// Shared palette, tuning constants and tiny helpers.

export const C = { navy: 0x1d3557, cream: 0xfff8e7, yellow: 0xffd166, mint: 0x06d6a0, red: 0xef476f, blue: 0x3a86ff,
  pink: 0xf4a3c4, orange: 0xf8961e, pearl: 0xfdf6ec, waterTop: 0x5ed3f3, waterBot: 0x123c69, sand: 0xf2cc8f, sandDark: 0xd9a95f };

export const ROUND_SEC = 60;  // one round is a minute of popping
export const HUD_H = 64;      // height of the top bar
export const COMBO_GAP = 3;   // seconds between pops that still keep a combo going
export const HINT_AFTER = 3;  // seconds a bubble stays selected before its partner glows

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rnd = (a, b) => a + Math.random() * (b - a);
export const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const ease = p => p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
export const easeOut = p => 1 - (1 - p) ** 3;
export const easeIn = p => p * p;

// Bold rounded label used across the HUD.
export const txt = (size, fill, weight = '900') => {
  const t = new PIXI.Text({ text: '', style: { fontFamily: 'system-ui', fontSize: size, fontWeight: weight, fill } });
  t.anchor.set(.5); return t;
};
