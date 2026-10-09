// Game time (paused with the ticker) and `later()` callbacks that run on it.
export const clock = { t: 0 };
let timers = [];

export const later = (sec, fn) => timers.push({ t: sec, fn });
export const clearTimers = () => { timers = []; };

export function tickClock(dt) {
  clock.t += dt;
  for (const tm of timers) tm.t -= dt;
  const due = timers.filter(tm => tm.t <= 0);
  timers = timers.filter(tm => tm.t > 0);
  due.forEach(tm => tm.fn());
}
