// The PIXI application and its top-level layers (back to front).
export const app = new PIXI.Application();
await app.init({ resizeTo: window, background: 0x9bd4f5, antialias: true, autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2) });
document.getElementById('game').appendChild(app.canvas);

export const streetLayer = new PIXI.Container();  // sky, buildings, road
export const world = new PIXI.Container();        // cars, sorted by lane depth
export const ui = new PIXI.Container();           // HUD and the compare panel
export const fxLayer = new PIXI.Container();      // dust, confetti, comic words, flying coins (on top of everything)
world.sortableChildren = true;
app.stage.addChild(streetLayer, world, ui, fxLayer);
