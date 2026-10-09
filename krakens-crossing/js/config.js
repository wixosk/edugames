// Shared palette, tuning constants and tiny helpers.

export const C = { navy: 0x1d3557, deep: 0x073b4c, sea: 0x0b6e8f, cream: 0xfff8e7, yellow: 0xffd166,
  green: 0x06a77d, mint: 0x06d6a0, red: 0xef476f, blue: 0x3a86ff, orange: 0xe76f51, kraken: 0x6a2c91 };

export const ROUND_LEN = 8;          // problems per round (plus one retry per missed fact)
export const MASTERED_STREAK = 3;    // quick-and-correct streak that hides the dot pictures
export const QUICK_SECONDS = 5;      // slowest step time that still counts towards the streak

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const now = () => performance.now();
export const rnd = (a, b) => a + Math.random() * (b - a);
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const lerpColor = (a, b, k) => {
  const ch = (c, sh) => (c >> sh) & 255, mix = sh => Math.round(ch(a, sh) + (ch(b, sh) - ch(a, sh)) * k);
  return (mix(16) << 16) | (mix(8) << 8) | mix(0);
};

// Bold rounded label used across the HUD.
export const txt = (size, fill, weight = '900') => {
  const t = new PIXI.Text({ text: '', style: { fontFamily: 'system-ui', fontSize: size, fontWeight: weight, fill } });
  t.anchor.set(.5); return t;
};
