// The PIXI application and its three top-level layers (back to front).
export const app = new PIXI.Application();
await app.init({ resizeTo: window, background: 0x0b6e8f, antialias: true, autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2) });
document.getElementById('game').appendChild(app.canvas);

export const seaLayer = new PIXI.Container();  // water, waves, lane guides
export const world = new PIXI.Container();     // crossing, boat, effects
export const ui = new PIXI.Container();        // top bar, number line, screen flash
app.stage.addChild(seaLayer, world, ui);
