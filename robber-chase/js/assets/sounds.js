// Every sound effect in the game, built from the synth primitives.
import { tone, slide, noise } from '../audio.js';

// Counting notes climb a major scale, so "more coins" literally sounds higher.
const SCALE = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];

export const sfx = {
  siren: (n = 3) => { for (let i = 0; i < n; i++) { tone(960, .26, 'square', .035, i * .52); tone(720, .26, 'square', .035, i * .52 + .26); } },
  vroom: () => { slide(70, 210, .7, 'sawtooth', .07); noise(.6, .08, 500); },
  zoom: () => { slide(140, 420, .5, 'sawtooth', .05); noise(.5, .12, 2600); },
  screech: () => { noise(.45, .2, 4200); slide(1500, 900, .4, 'triangle', .04); },
  caught: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .22, 'triangle', .16, i * .09)),
  boing: () => { slide(220, 880, .35, 'triangle', .14); slide(880, 330, .3, 'triangle', .08, .3); },
  coin: i => { const f = SCALE[Math.min(i, SCALE.length - 1)]; tone(f, .18, 'triangle', .15); tone(f * 2, .1, 'sine', .05, .02); },
  pair: i => tone(SCALE[Math.min(i, SCALE.length - 1)], .16, 'sine', .14),
  extra: () => { tone(1319, .15, 'triangle', .13); tone(1568, .25, 'triangle', .13, .1); },
  pop: () => slide(400, 900, .12, 'sine', .12),
  done: () => [523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, .25, 'triangle', .15, i * .1)),
};
