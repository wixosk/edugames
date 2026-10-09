// Tap anywhere: the nearest bubble under the finger is picked (see bubbleAt for the margin).
import { app } from './app.js';
import { tapAt } from './game.js';

export function initInput() {
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', e => tapAt(e.global.x, e.global.y));
}
