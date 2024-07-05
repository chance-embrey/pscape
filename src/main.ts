import {
  ArcRotateCamera,
  Color3,
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";

class App {
  engine: Engine;
  scene: Scene;
  constructor(readonly canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    window.addEventListener("resise", () => {
      this.engine.resize();
    });
    this.scene = createScene(this.engine, this.canvas);
  }

  run() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

function createScene(engine: Engine, canvas: HTMLCanvasElement) {
  const scene = new Scene(engine);

  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  light.intensity = 0.7;

  const player = MeshBuilder.CreateCapsule("sphere", { height: 2 }, scene);

  player.position.y = 1;

  const camera = new ArcRotateCamera(
    "thirdPersonCamera",
    0,
    0,
    10,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.setPosition(new Vector3(0, 12, 10));
  camera.checkCollisions = false;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 20;
  camera.keysUp = [38, 87]; // Up and W
  camera.keysDown = [40, 83]; // Down and S
  camera.keysLeft = [37, 65]; // Left and A
  camera.keysRight = [39, 68]; // Right and D
  camera.angularSensibilityX = 1000;
  camera.angularSensibilityY = 1000;
  camera.inertia = 0.75;
  camera.setTarget(player, false);
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = Math.PI / 2;

  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 30, height: 30 },
    scene,
  );

  return scene;
}

console.log("starting game...");

window.addEventListener("DOMContentLoaded", () => {
  const canvasId = "renderCanvas";
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas)
    throw new Error(`Canvas element with id ${canvasId} not found in the DOM`);
  let app = new App(canvas);
  app.run();
});
