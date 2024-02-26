import * as THREE from "three";
import { type IEngine } from "./Interfaces/IEngine";
import { type ISceneController } from "./Interfaces/ISceneController";
import { SceneController as BaseSceneController } from "./SceneController";
import { type ICameraController } from "./Interfaces/ICameraController";

interface EngineParams<Camera extends THREE.Camera> {
  canvas: HTMLCanvasElement;
  cameraController: ICameraController<Camera>;
  SceneControllerClass?: new () => ISceneController;
}

export class Engine<Camera extends THREE.Camera = THREE.PerspectiveCamera> implements IEngine<Camera> {
  private readonly _renderer: THREE.WebGLRenderer;
  private readonly _sceneController: ISceneController;
  private readonly _cameraController: ICameraController<Camera>;

  constructor({ canvas, cameraController, SceneControllerClass = BaseSceneController }: EngineParams<Camera>) {
    this._cameraController = cameraController;
    this._renderer = new THREE.WebGLRenderer({
      canvas,
    });
    this._sceneController = new SceneControllerClass();

    this.initCamera();
    this.initRenderer();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  render() {
    this._renderer.render(this._sceneController.getScene(), this._cameraController.getCamera());
  }

  getCamera() {
    return this._cameraController.getCamera();
  }

  getSceneController() {
    return this._sceneController;
  }

  getRenderer() {
    return this._renderer;
  }

  private onWindowResize() {
    const camera = this._cameraController.getCamera();

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  private initCamera() {
    this._cameraController.getCamera().position.z = 1;
    this._cameraController.getCamera().position.y = 0;
    this._cameraController.getCamera().rotateX(Math.PI / 6);
  }

  private initRenderer() {
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
