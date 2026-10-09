// The PIXI application and its top-level layers (back to front).
export const app = new PIXI.Application();
await app.init({ resizeTo: window, background: 0x1b4965, antialias: true, autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2) });
document.getElementById('game').appendChild(app.canvas);

export const seaLayer = new PIXI.Container();  // water, light rays, fish, seaweed, sand
export const world = new PIXI.Container();     // the bubbles you can pop
export const ui = new PIXI.Container();        // HUD and the "3 + ? = 10" helper
export const fxLayer = new PIXI.Container();   // splashes, sparkles, comic words, flying pearls
app.stage.addChild(seaLayer, world, ui, fxLayer);
