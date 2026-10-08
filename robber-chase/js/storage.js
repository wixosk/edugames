// Totals kept in localStorage. The root dashboard reads the same key, so keep the shape stable.
const STORE = 'robber-chase-v1';

// Mutated in place (never reassigned) so every importer sees the same object.
export const save = { caught: 0, coins: 0 };
try { const s = JSON.parse(localStorage.getItem(STORE)); if (s) Object.assign(save, s); } catch {}

export const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} };
