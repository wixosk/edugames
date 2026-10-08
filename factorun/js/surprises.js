// What happens at the crossing: slapstick surprises for a wrong answer (~1.4s each, then the boat is back to
// normal) and the celebration for a right one.
import { C, pick, txt } from './config.js';
import { clock, later } from './clock.js';
import { S, L } from './state.js';
import { sfx } from './assets/sounds.js';
import { drawRock } from './assets/rock.js';
import { makeBarrel, makeStormCloud, makeBolt, drawTentacle } from './assets/hazards.js';
import { anim, fxLayer, splash, smoke, fireball, confetti, comic, flashScreen } from './fx.js';
import { boat, BF, shake } from './view/boat.js';
import { gate, rockSize } from './view/crossing.js';
import { starPill } from './view/topbar.js';

export const surprises = {
  kraken(bx, by) {
    sfx.rumble();
    const tg = new PIXI.Graphics(); fxLayer.addChild(tg);
    const side = bx > L.W / 2 ? -1 : 1;
    const draw = grow => drawTentacle(tg, bx, by - 6 + BF.dy, side, grow, clock.t);
    anim(1.4, p => {
      if (p < .3) draw(p / .3);
      else if (p < .75) { BF.dy = -34 * Math.min(1, (p - .3) / .1); BF.rot = Math.sin(clock.t * 28) * .35; draw(1); }
      else { const q = (p - .75) / .25; BF.dy = -34 * (1 - q); BF.rot *= .8; draw(1 - q); }
    }, () => { tg.destroy(); BF.rot = 0; BF.dy = 0; });
    later(1.05, () => { splash(bx, by); comic('SPLOOSH!', bx, by - 120, 0x8ecae6); });
  },
  // `existing`: the boat hit the hint rock that's already there, so don't add one.
  reef(bx, by, existing) {
    let rock = null;
    if (!existing) {
      rock = drawRock(new PIXI.Graphics(), rockSize() * 1.2); rock.position.set(bx, by - 52); rock.scale.set(0);
      fxLayer.addChildAt(rock, 0);
      anim(.15, p => rock.scale.set(p));
    }
    later(.15, () => { sfx.bonk(); comic('BONK!', bx, by - 120); shake(.25); });
    later(.2, () => anim(.75, p => { BF.dy = -80 * Math.sin(Math.PI * p); BF.rot = p * Math.PI * 2; },
      () => { BF.rot = 0; BF.dy = 0; splash(bx, by, 12); dizzy(); }));
    if (rock) later(1.6, () => anim(.4, p => rock.scale.set(1 - p), () => rock.destroy()));
  },
  boom(bx, by) {
    const barrel = makeBarrel();
    barrel.position.set(bx, by - 58); barrel.scale.set(0); fxLayer.addChild(barrel);
    sfx.fuse();
    anim(.4, p => { barrel.scale.set(Math.min(1, p * 4)); barrel.rotation = Math.sin(clock.t * 30) * .15; },
      () => {
        barrel.destroy(); sfx.boom(); shake(.6);
        flashScreen(0xffb703, .6);
        fireball(bx, by - 50);
        smoke(bx, by - 30, 10); BF.soot = 1;
        comic('KA-BOOM!', bx, by - 130, 0xffb703);
        anim(.5, p => BF.dy = -40 * Math.sin(Math.PI * p));
      });
  },
  zap(bx, by) {
    const cloud = makeStormCloud();
    cloud.position.set(bx, by - 150); cloud.alpha = 0; fxLayer.addChild(cloud);
    sfx.rumble();
    anim(.35, p => cloud.alpha = p, () => {
      const bolt = makeBolt(bx, by - 130, by - 10); fxLayer.addChild(bolt);
      sfx.zap(); shake(.5); flashScreen(0xffffff, .85);
      BF.soot = 1; smoke(bx, by - 10, 6);
      comic('ZAP!', bx, by - 120, 0xfff3b0);
      anim(.35, p => bolt.alpha = Math.sin(p * 30) > 0 ? 1 : 0, () => bolt.destroy());
      later(.7, () => anim(.4, p => cloud.alpha = 1 - p, () => cloud.destroy()));
    });
  },
};

// Hitting the hint rock is always a BONK; otherwise something random (never the same twice in a row).
export function wrongAnswer(bx, by) {
  if (S.sel === gate.hint) S.lastSurprise = 'reef';
  else S.lastSurprise = pick(Object.keys(surprises).filter(k => k !== S.lastSurprise));
  surprises[S.lastSurprise](bx, by, S.sel === gate.hint);
}

function dizzy() {
  const stars = [0, 1, 2].map(() => { const s = txt(20, 0xffffff); s.text = '⭐'; fxLayer.addChild(s); return s; });
  anim(1.2, p => stars.forEach((s, i) => {
    const a = clock.t * 7 + i * 2.1;
    s.position.set(boat.x + Math.cos(a) * 30, boat.y - 52 + Math.sin(a) * 9); s.alpha = p > .8 ? (1 - p) * 5 : 1;
  }), () => stars.forEach(s => s.destroy()));
}

export function celebrate(bx, by) {
  gate.beam = 'win';
  sfx.good();
  confetti(bx, by - 30);
  comic(pick(['Safe!', 'Yay!', 'Ahoy!', 'Nice!', 'Woohoo!']), bx, by - 120, C.mint);
  anim(.45, p => BF.sc = 1 + .3 * Math.sin(Math.PI * p));
  anim(.5, p => starPill.scale.set(1 + .35 * Math.sin(Math.PI * p)));
  if (S.streak >= 3) later(.45, () => comic(`🔥 ${S.streak} in a row!`, L.W / 2, L.seaTop + 70, 0xffb703, .8));
}
