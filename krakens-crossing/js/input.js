// Drag/tap anywhere on the sea to steer; GO commits.
import { app } from './app.js';
import { S, L } from './state.js';
import { laneAt } from './view/numberline.js';
import { goBtn } from './dom.js';
import { select, commit } from './game.js';

export function initInput() {
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  let dragging = false;
  const steer = x => { if (S.step) select(laneAt(x)); };
  app.stage.on('pointerdown', e => { if (e.global.y < L.seaTop) return; dragging = true; steer(e.global.x); });
  app.stage.on('pointermove', e => { if (dragging) steer(e.global.x); });
  app.stage.on('pointerup', () => dragging = false);
  app.stage.on('pointerupoutside', () => dragging = false);
  goBtn.addEventListener('pointerdown', e => { e.preventDefault(); commit(true); });
}
