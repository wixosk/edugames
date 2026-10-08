// Top bar: the loot chest (coins brought back) and one jail slot per robber in the round.
import { ROUND_LEN, HUD_H, clamp, txt } from '../config.js';
import { L } from '../state.js';
import { drawRobberFace } from '../assets/robber.js';
import { makeItem } from '../assets/loot.js';
import { anim } from '../fx.js';

export const hud = new PIXI.Container();
const chest = new PIXI.Container(), chestBg = new PIXI.Graphics(), coinIcon = makeItem('coin', 15), coinText = txt(26, 0xffffff);
chest.addChild(chestBg, coinIcon, coinText);
const slots = new PIXI.Container();
hud.addChild(chest, slots);

let coins = 0, caught = 0, slotS = 40;

function drawChest() {
  coinText.text = String(coins);
  const w = 52 + coinText.width + 16;
  chestBg.clear().roundRect(0, 0, w, 46, 23).fill({ color: 0x000000, alpha: .3 });
  coinIcon.position.set(26, 23); coinText.position.set(46 + coinText.width / 2, 24);
}

function drawSlots() {
  slots.removeChildren().forEach(c => c.destroy());
  for (let i = 0; i < ROUND_LEN; i++) {
    const g = new PIXI.Graphics(), x = i * (slotS + 8);
    if (i < caught) {
      g.roundRect(x, 0, slotS, slotS, 10).fill(0xe9e3d3).stroke({ width: 3, color: 0x5c677d });
      drawRobberFace(g, x + slotS / 2, slotS * .58, slotS * .3);
      for (let k = 1; k < 4; k++) g.rect(x + k * slotS / 4 - 2, 2, 4, slotS - 4).fill(0x5c677d);
    } else {
      g.roundRect(x, 0, slotS, slotS, 10).fill({ color: 0xffffff, alpha: .45 }).stroke({ width: 3, color: 0xffffff, alpha: .8 });
    }
    slots.addChild(g);
  }
}

export function layoutHud() {
  chest.position.set(14, 10);
  drawChest();
  // Slots sit between the chest and the ✕ button, centred when there's room.
  const left = 14 + chestBg.width + 14, right = L.W - 70;
  slotS = clamp((right - left) / ROUND_LEN - 8, 26, 44);
  const w = ROUND_LEN * (slotS + 8) - 8;
  slots.position.set(clamp((L.W - w) / 2, left, Math.max(left, right - w)), (HUD_H - slotS) / 2);
  drawSlots();
}

export function resetHud() { coins = 0; caught = 0; layoutHud(); }

export const chestTarget = () => ({ x: chest.x + 26, y: chest.y + 23 });

const bump = (obj, k = .3) => anim(.3, p => obj.scale.set(1 + k * Math.sin(Math.PI * p)));

export function addCoin() { coins++; drawChest(); bump(coinIcon, .5); }

export function fillSlot() {
  caught++; drawSlots();
  const g = slots.children[caught - 1];
  if (g) { g.pivot.set((caught - 1) * (slotS + 8) + slotS / 2, slotS / 2); g.position.copyFrom(g.pivot); bump(g, .4); }
}
