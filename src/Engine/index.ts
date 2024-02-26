import { Engine } from "./Core/Engine";
import { PerspectiveCameraController } from "./Core/PerspectiveCameraController";

const canvas = document.getElementById("three-view") as HTMLCanvasElement;

const cameraController = new PerspectiveCameraController();

const engine = new Engine({
  canvas,
  cameraController,
});

function animate() {
  requestAnimationFrame(animate);

  engine.render();
}
animate();

export default engine;
