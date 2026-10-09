// Totals kept in localStorage. The root dashboard reads the same key, so keep the shape stable.
//   pairs – pairs popped ever, rounds – rounds finished, best – { [level id]: most pairs in one round }
const STORE = 'bubble-pop-v1';

// Mutated in place (never reassigned) so every importer sees the same object.
export const save = { pairs: 0, rounds: 0, best: {} };
try { const s = JSON.parse(localStorage.getItem(STORE)); if (s) Object.assign(save, s); } catch {}

export const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} };
