// Tap anywhere: the top half of the road picks the back robber, the bottom half the front one.
import { app } from './app.js';
import { L } from './state.js';
import { pickLane } from './game.js';

export function initInput() {
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', e => pickLane(e.global.y < L.split ? 0 : 1));
}
