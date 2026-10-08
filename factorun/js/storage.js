// Progress kept in localStorage. The root dashboard reads `stats` from the same key, so keep the shape stable.
const STORE = 'kraken-crossing-v1';
const fresh = () => ({ stats: {}, approachT: 9 });

// Mutated in place (never reassigned) so every importer sees the same object.
export const save = fresh();
try { const s = JSON.parse(localStorage.getItem(STORE)); if (s) Object.assign(save, s); } catch {}

export const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} };

export function resetProgress() {
  for (const k of Object.keys(save)) delete save[k];
  Object.assign(save, fresh());
  persist();
}
