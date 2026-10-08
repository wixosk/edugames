// HTML overlays and buttons around the canvas (menu, summary, ✕).
import { LEVELS } from './levels.js';

export const $ = id => document.getElementById(id);
export const show = (id, on) => $(id).classList.toggle('hidden', !on);
// body.playing hides the root update.js "new version" pill mid-round; it shows again on menu/summary.
export const setPlaying = on => document.body.classList.toggle('playing', on);

export function buildLevelButtons(onPick) {
  const box = $('levels');
  for (const lv of LEVELS) {
    const b = document.createElement('button');
    b.className = 'lvl'; b.dataset.level = lv.id; b.style.setProperty('--c', lv.color);
    b.innerHTML = `<span class="ico">${lv.icon}</span><b>${lv.title}</b><span>${lv.blurb}</span>`;
    b.onclick = () => onPick(lv);
    box.appendChild(b);
  }
}

export function showSummary(caught, coins) {
  $('jail').textContent = '🦹'.repeat(caught);
  $('sumText').textContent = `You caught ${caught} robbers and brought back ${coins} coins!`;
  show('summary', true);
}
