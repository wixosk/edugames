// The crossing that sweeps down towards the boat: a lighthouse whose beam marks the line,
// plus at most one hint rock on a wrong number.
import { C, clamp } from '../config.js';
import { clock } from '../clock.js';
import { S, L } from '../state.js';
import { makeLighthouse, LAMP_Y } from '../assets/lighthouse.js';
import { drawRock } from '../assets/rock.js';
import { laneX } from './numberline.js';
import { boat } from './boat.js';

export const gate = { y: -200, active: false, hint: null, beam: 'idle' }; // beam: idle | win | lose

export const crossing = new PIXI.Container();
const beam = new PIXI.Graphics(), hintRock = new PIXI.Graphics(), lighthouse = makeLighthouse();
crossing.addChild(beam, hintRock, lighthouse.root);

export const rockSize = () => clamp((L.laneR - L.laneL) / 10 * .8, 26, 56);

// Bring a fresh crossing in at the top; `hint` is the lane for the rock (or null).
export function resetGate(hint) {
  Object.assign(gate, { active: true, y: L.seaTop - 20, beam: 'idle', hint });
  drawRock(hintRock.clear(), rockSize());
}

export function drawCrossing() {
  crossing.visible = gate.active;
  if (!gate.active) return;
  const t = clock.t;
  crossing.y = gate.y;
  const ls = L.W < 700 ? .7 : 1, lx = (L.laneR + L.W) / 2 + 4;
  lighthouse.root.position.set(lx, 0); lighthouse.root.scale.set(ls);
  const pulse = .5 + .5 * Math.sin(t * 4);
  const col = gate.beam === 'win' ? C.yellow : gate.beam === 'lose' ? C.red : 0xfff3b0;
  lighthouse.glow.tint = col;
  lighthouse.glow.alpha = gate.beam === 'lose' ? (Math.sin(t * 18) > 0 ? .9 : .15) : .45 + .35 * pulse;
  beam.clear();
  const ly = LAMP_Y * ls;
  if (gate.beam === 'win') {
    const by = boat.y - gate.y;
    beam.poly([lx, ly, boat.x - 45, by - 30, boat.x + 45, by + 30]).fill({ color: C.yellow, alpha: .35 });
  } else {
    beam.poly([lx, ly, L.laneL - 40, -26, L.laneL - 40, 26]).fill({ color: col, alpha: .1 + .05 * pulse });
  }
  for (let x = 6; x < lx - 34; x += 26) beam.roundRect(x, -3, 14, 6, 3).fill({ color: col, alpha: .55 + .3 * pulse });
  hintRock.visible = gate.hint != null && S.step != null;
  if (hintRock.visible) hintRock.position.set(laneX(gate.hint), 0);
}
