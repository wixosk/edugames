// Tiny Web Audio synth. Sound effects themselves live in assets/sounds.js.
let actx = null;

// iOS: Web Audio follows the ringer/silent switch unless the page asks for 'playback'.
try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}

export function unlockAudio() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state !== 'running') actx.resume();
  } catch {}
}
// Safari can leave the context 'suspended'/'interrupted' (calls, Siri, app switch), so re-resume on every touch.
['pointerdown', 'touchend', 'keydown'].forEach(ev => window.addEventListener(ev, unlockAudio, { capture: true, passive: true }));

export function tone(f, d, type = 'sine', vol = .15, delay = 0) {
  if (!actx) return;
  const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .05);
}

export function slide(f1, f2, d, type = 'sine', vol = .12, delay = 0) {
  if (!actx) return;
  const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .05);
}

export function noise(d, vol = .25, freq = 1000, delay = 0) {
  if (!actx) return;
  const len = Math.floor(actx.sampleRate * d), buf = actx.createBuffer(1, len, actx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
  src.buffer = buf; f.type = 'lowpass'; f.frequency.value = freq; g.gain.value = vol;
  src.connect(f).connect(g).connect(actx.destination); src.start(actx.currentTime + delay);
}
