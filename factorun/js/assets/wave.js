// Short white wave crest for the scrolling sea.
export const makeWave = () =>
  new PIXI.Graphics().moveTo(-14, 0).quadraticCurveTo(0, -8, 14, 0).stroke({ width: 3, color: 0xffffff, alpha: .22, cap: 'round' });
