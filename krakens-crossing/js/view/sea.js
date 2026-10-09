// Open water with wave crests that scroll past at the world's speed.
import { C } from '../config.js';
import { S, L } from '../state.js';
import { makeWave } from '../assets/wave.js';

export const sea = new PIXI.Container();
const bg = new PIXI.Graphics();
const waves = Array.from({ length: 40 }, makeWave);
sea.addChild(bg, ...waves);

export function layoutSea() {
  bg.clear().rect(0, 0, L.W, L.H).fill(C.sea);
  for (const w of waves) w.position.set(Math.random() * L.W, L.seaTop + Math.random() * (L.seaBot - L.seaTop));
}

export function updateSea(dt) {
  for (const w of waves) {
    w.y += (S.worldSpeed + 20) * dt;
    if (w.y > L.seaBot + 10) { w.y = L.seaTop - 10; w.x = Math.random() * L.W; }
  }
}
