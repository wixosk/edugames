// HTML overlays and buttons around the canvas (menu, summary, ✕).
import { LEVELS } from './levels.js';
import { save } from './storage.js';

export const $ = id => document.getElementById(id);
export const show = (id, on) => $(id).classList.toggle('hidden', !on);
// body.playing hides the root update.js "new version" pill mid-round; it shows again on menu/summary.
export const setPlaying = on => document.body.classList.toggle('playing', on);

export function buildLevelButtons(onPick) {
  const box = $('levels');
  for (const lv of LEVELS) {
    const b = document.createElement('button');
    b.className = 'lvl'; b.dataset.level = lv.id; b.style.setProperty('--c', lv.color);
    b.innerHTML = `<span class="ico">${lv.icon}</span><b>${lv.title}</b><span>${lv.blurb}</span><span class="best"></span>`;
    b.onclick = () => onPick(lv);
    box.appendChild(b);
  }
  refreshBests();
}

export function refreshBests() {
  for (const lv of LEVELS) {
    const best = save.best[lv.id], el = $('levels').querySelector(`[data-level="${lv.id}"] .best`);
    if (el) el.textContent = best ? `🏆 Best: ${best}` : '';
  }
}

export function showSummary(score, target, isBest) {
  $('sumScore').textContent = score;
  $('sumText').textContent = score === 0 ? 'Have another go. You can do it!'
    : `You popped ${score} pair${score === 1 ? '' : 's'}${target ? ` that make ${target}` : ''}!`;
  show('sumBest', isBest);
  show('summary', true);
}
