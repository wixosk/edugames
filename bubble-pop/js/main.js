// Bubble Pop entry point: assemble the scene, wire the menu, run the loop.
import { app, seaLayer, ui } from './app.js';
import { tickClock } from './clock.js';
import { unlockAudio } from './audio.js';
import { save } from './storage.js';
import { S, L, settings } from './state.js';
import { layout } from './layout.js';
import { updateFx } from './fx.js';
import { sea, updateSea } from './view/sea.js';
import { hud, updateHud } from './view/hud.js';
import { bubbles } from './view/bubbles.js';
import { startRound, toMenu, updateGame } from './game.js';
import { initInput } from './input.js';
import { $, show, buildLevelButtons } from './dom.js';

// ---------------------------------------------------------------- scene (bubbles add themselves to `world`)
seaLayer.addChild(sea);
ui.addChild(hud);

// ---------------------------------------------------------------- loop
app.ticker.add(tk => {
  const dt = Math.min(tk.deltaMS / 1000, .05);
  tickClock(dt);
  updateFx(dt);
  updateSea(dt);
  updateGame(dt);
  updateHud(dt);
});

// ---------------------------------------------------------------- menu & DOM
initInput();
buildLevelButtons(level => { unlockAudio(); show('menu', false); startRound(level); });
$('again').onclick = () => { show('summary', false); startRound(); };
$('toMenu').onclick = toMenu;
$('quit').onclick = toMenu;

window.addEventListener('resize', () => { app.resize(); layout(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) app.ticker.stop(); else { app.ticker.start(); unlockAudio(); } });
document.addEventListener('gesturestart', e => e.preventDefault());

layout();
window.__game = { S, L, save, settings, bubbles, app }; // debug handle
