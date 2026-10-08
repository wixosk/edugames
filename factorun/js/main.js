// Kraken Crossing entry point: assemble the scene, wire the menu, run the loop.
import { app, seaLayer, world, ui } from './app.js';
import { tickClock } from './clock.js';
import { unlockAudio } from './audio.js';
import { save, resetProgress } from './storage.js';
import { S, L, settings } from './state.js';
import { layout } from './layout.js';
import { fxLayer, flash, updateFx } from './fx.js';
import { surprises, celebrate } from './surprises.js';
import { sea, updateSea } from './view/sea.js';
import { lanes, numberBar } from './view/numberline.js';
import { crossing } from './view/crossing.js';
import { boat, updateBoat } from './view/boat.js';
import { topBg, eqLayer, starPill } from './view/topbar.js';
import { hud, noHint, updateTenFrames } from './view/tenframe.js';
import { startRound, toMenu, updateGame } from './game.js';
import { initInput } from './input.js';
import { $, show, buildLevelButtons } from './dom.js';

// ---------------------------------------------------------------- scene (back to front)
seaLayer.addChild(sea, lanes);
world.addChild(crossing, boat, fxLayer);
ui.addChild(topBg, hud, noHint, eqLayer, starPill, numberBar, flash);

// ---------------------------------------------------------------- loop
app.ticker.add(tk => {
  const dt = Math.min(tk.deltaMS / 1000, .05);
  tickClock(dt);
  updateGame(dt);
  updateFx(dt);
  updateSea(dt);
  updateBoat(dt);
  updateTenFrames(dt);
});

// ---------------------------------------------------------------- menu & DOM
initInput();
buildLevelButtons(level => { unlockAudio(); show('menu', false); startRound(level); });

const tTimer = $('tTimer');
function renderToggles() {
  tTimer.textContent = settings.timer ? '⏱ Timer: on' : '⏱ Timer: off';
  tTimer.classList.toggle('on', settings.timer);
}
tTimer.onclick = () => { settings.timer = !settings.timer; renderToggles(); };
renderToggles();
$('reset').onclick = () => { if (confirm('Forget all progress and speed?')) resetProgress(); };
$('again').onclick = () => { show('summary', false); startRound(); };
$('toMenu').onclick = toMenu;
$('quit').onclick = toMenu;

window.addEventListener('resize', () => { app.resize(); layout(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) app.ticker.stop(); else { app.ticker.start(); unlockAudio(); } });
document.addEventListener('gesturestart', e => e.preventDefault());

layout();
window.__game = { S, save, settings, surprises, celebrate, boat, L: () => L, app }; // debug handle
