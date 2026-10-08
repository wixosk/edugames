// Robber Chase entry point: assemble the scene, wire the menu, run the loop.
import { app, streetLayer, ui } from './app.js';
import { tickClock } from './clock.js';
import { unlockAudio } from './audio.js';
import { save } from './storage.js';
import { S, L, settings } from './state.js';
import { layout } from './layout.js';
import { updateFx } from './fx.js';
import { street, updateStreet } from './view/street.js';
import { police, robbers, updateCars, homePolice } from './view/cars.js';
import { hud } from './view/hud.js';
import { comparePanel, updateCompare } from './view/compare.js';
import { startRound, toMenu, streetSpeed } from './game.js';
import { initInput } from './input.js';
import { $, show, buildLevelButtons } from './dom.js';

// ---------------------------------------------------------------- scene (back to front; cars add themselves to `world`)
streetLayer.addChild(street);
ui.addChild(hud, comparePanel);

// ---------------------------------------------------------------- loop
app.ticker.add(tk => {
  const dt = Math.min(tk.deltaMS / 1000, .05);
  tickClock(dt);
  updateFx(dt);
  updateStreet(dt, streetSpeed());
  updateCars();
  updateCompare();
});

// ---------------------------------------------------------------- menu & DOM
initInput();
buildLevelButtons(level => { unlockAudio(); show('menu', false); startRound(level); });
$('again').onclick = () => { show('summary', false); startRound(); };
$('toMenu').onclick = toMenu;
$('quit').onclick = toMenu;

window.addEventListener('resize', () => { app.resize(); layout(S.phase === 'choose'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) app.ticker.stop(); else { app.ticker.start(); unlockAudio(); } });
document.addEventListener('gesturestart', e => e.preventDefault());

layout();
homePolice();
window.__game = { S, L, save, settings, police, robbers, app }; // debug handle
