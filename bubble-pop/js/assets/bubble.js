// A glassy bubble with a big number. `ring` is the yellow "picked" halo, `glow` the mint hint halo.
import { C } from '../config.js';

// Tints are random, never tied to the number, so colour can't give a pair away.
export const TINTS = [0x8ecae6, 0xbde0fe, 0xcdb4db, 0xa0e8af, 0xffc8dd, 0xffe5a0];

export function makeBubble(n, r, tint) {
  const c = new PIXI.Container();
  const glow = new PIXI.Graphics().circle(0, 0, r * 1.3).fill({ color: C.mint, alpha: .6 }).circle(0, 0, r * 1.3).stroke({ width: r * .08, color: 0xffffff, alpha: .8 });
  const ring = new PIXI.Graphics().circle(0, 0, r * 1.1).stroke({ width: r * .14, color: C.yellow });
  glow.visible = ring.visible = false;
  const body = new PIXI.Graphics()
    .circle(0, 0, r).fill({ color: tint, alpha: .62 })
    .circle(0, -r * .1, r * .72).fill({ color: 0xffffff, alpha: .14 })
    .circle(0, 0, r).stroke({ width: Math.max(2, r * .06), color: 0xffffff, alpha: .95 })
    .ellipse(-r * .4, -r * .45, r * .26, r * .14).fill({ color: 0xffffff, alpha: .8 })
    .circle(r * .48, r * .46, r * .07).fill({ color: 0xffffff, alpha: .55 });
  const label = new PIXI.Text({ text: String(n), style: { fontFamily: 'system-ui', fontSize: r * (n > 9 ? .82 : 1),
    fontWeight: '900', fill: 0xffffff, stroke: { color: C.navy, width: r * .16, join: 'round' } } });
  label.anchor.set(.5); label.y = r * .04;
  c.addChild(glow, ring, body, label);
  return { c, glow, ring };
}

// A small shiny pearl: one per popped pair, it flies up to the counter.
export function makePearl(r) {
  return new PIXI.Graphics()
    .circle(0, 0, r).fill(C.pearl).stroke({ width: Math.max(1.5, r * .12), color: 0xd8cfc0 })
    .circle(-r * .32, -r * .32, r * .3).fill({ color: 0xffffff, alpha: .95 });
}
