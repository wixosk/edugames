// Every sound effect in the game, built from the synth primitives.
import { tone, slide, noise } from '../audio.js';

// Pops climb a major scale with the combo, so a streak literally sounds like it's going up.
const SCALE = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1397, 1568];
const note = i => SCALE[Math.min(i, SCALE.length - 1)];

export const sfx = {
  pick: () => { slide(300, 620, .09, 'sine', .12); },
  unpick: () => slide(620, 300, .09, 'sine', .08),
  join: () => slide(200, 520, .2, 'triangle', .08),
  pop: combo => {
    noise(.07, .35, 3500); slide(500, 1400, .08, 'sine', .14);
    const f = note(combo); tone(f, .2, 'triangle', .14, .05); tone(f * 1.5, .25, 'triangle', .08, .12);
  },
  boing: () => { slide(220, 660, .22, 'triangle', .14); slide(660, 260, .25, 'triangle', .08, .2); },
  plip: () => { noise(.04, .08, 5000); slide(900, 1500, .05, 'sine', .04); },
  tick: () => tone(1100, .06, 'square', .05),
  whoosh: () => { noise(.5, .15, 1800); slide(200, 900, .45, 'sine', .07); },
  pearl: () => { tone(1760, .12, 'sine', .07); tone(2349, .14, 'sine', .05, .05); },
  go: () => [392, 523, 659, 784].forEach((f, i) => tone(f, .16, 'triangle', .13, i * .08)),
  done: () => [523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, .25, 'triangle', .15, i * .1)),
};
