// Every sound effect in the game, built from the synth primitives.
import { tone, slide, noise } from '../audio.js';

export const sfx = {
  tick: () => tone(900, .04, 'triangle', .05),
  good: () => { tone(523, .15, 'triangle', .18); tone(659, .15, 'triangle', .18, .09); tone(784, .3, 'triangle', .18, .18); slide(400, 1400, .35, 'sine', .06, .1); },
  done: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .2, 'triangle', .16, i * .08)),
  splash: () => noise(.7, .35, 1400),
  bonk: () => { tone(320, .08, 'square', .12); slide(500, 1200, .3, 'triangle', .08, .08); },
  fuse: () => tone(1400, .3, 'square', .03),
  boom: () => { noise(1, .6, 450); noise(.5, .45, 2500); slide(120, 40, .6, 'sine', .35); slide(420, 110, .45, 'square', .1); },
  zap: () => { noise(.35, .3, 5000); slide(1800, 200, .3, 'sawtooth', .07); },
  rumble: () => { slide(90, 50, .8, 'sawtooth', .06); slide(260, 150, .8, 'sawtooth', .07); noise(.8, .12, 600); },
  wahwah: () => [392, 370, 349, 311].forEach((f, i) => slide(f, f * .97, i === 3 ? .6 : .22, 'sawtooth', .05, i * .24)),
};
