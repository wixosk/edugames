// HTML overlays and buttons around the canvas (menu, summary, GO, ✕).
import { LEVELS } from './levels.js';

export const $ = id => document.getElementById(id);
export const show = (id, on) => $(id).classList.toggle('hidden', !on);
// body.playing hides the root update.js "new version" pill mid-round; it shows again on menu/summary.
export const setPlaying = on => document.body.classList.toggle('playing', on);
export const goBtn = $('go');

export function buildLevelButtons(onPick) {
  const box = $('levels');
  for (const lv of LEVELS) {
    const b = document.createElement('button');
    b.className = 'lvl'; b.dataset.level = lv.id; b.style.setProperty('--c', lv.color);
    b.innerHTML = `<b>${lv.id} · ${lv.title}</b><span>${lv.blurb}</span>`;
    b.onclick = () => onPick(lv);
    box.appendChild(b);
  }
}

export function showSummary(stars, tricky) {
  $('sumStars').textContent = `⭐ ${stars}`;
  $('sumTricky').textContent = tricky.length ? `Tricky ones to practise: ${tricky.join(',  ')}` : 'No mistakes. What a captain!';
  show('summary', true);
}
