import THREE from "three";
import { type IEngine } from "../Core/Interfaces/IEngine";
import { MouseControls } from "./Interfaces/MouseControls";

interface INavigationParams {
  leftArea?: Element | null;
  rightArea?: Element | null;
  topArea?: Element | null;
  bottomArea?: Element | null;
}

const DEFAULT_NAVIGATION_PARAMS: INavigationParams = {
  leftArea: document.querySelector(".canvas-border__left"),
  rightArea: document.querySelector(".canvas-border__right"),
  topArea: document.querySelector(".canvas-border__top"),
  bottomArea: document.querySelector(".canvas-border__bottom"),
};

export class MapNavigationControls extends MouseControls {
  private readonly MIN_ZOOM_VALUE = 0.5;
  private readonly MAX_ZOOM_VALUE = 10;
  private readonly ZOOM_SPEED = 0.25;
  private readonly PAN_SPEED = 2;
  // TO DO movement on border
  private readonly _params: INavigationParams;

  private readonly _firstPoint: THREE.Vector3 = new THREE.Vector3();

  private readonly _onWheelBinded: (e: WheelEvent) => void;
  private readonly _onMouseMoveBinded: (e: MouseEvent) => void;
  private readonly _onMouseDownBinded: (e: MouseEvent) => void;
  private readonly _onMouseUpBinded: (e: MouseEvent) => void;

  constructor(engine: IEngine, params: INavigationParams = DEFAULT_NAVIGATION_PARAMS) {
    super(engine);

    this._params = params;
    this._onWheelBinded = this.onWheel.bind(this);
    this._onMouseMoveBinded = this.onMouseMove.bind(this);
    this._onMouseDownBinded = this.onMouseDown.bind(this);
    this._onMouseUpBinded = this.onMouseUp.bind(this);
  }

  private onWheel(e: WheelEvent) {
    const mousePosition = this.getWorldCoordinates(e);
    const camera = this._engine.getCamera();
    const speed = e.deltaY * 0.01 * this.ZOOM_SPEED;

    const dir = mousePosition.sub(camera.position).normalize();
    const pos = camera.position.clone().add(dir.multiplyScalar(-speed));

    if (pos.z < this.MAX_ZOOM_VALUE && pos.z > this.MIN_ZOOM_VALUE) {
      camera.position.copy(pos);
    }
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 1) {
      this._firstPoint.copy(this.getUnprojectCoordinates(e));

      this._engine.getRenderer().domElement.addEventListener("mousemove", this._onMouseMoveBinded);
      this._engine.getRenderer().domElement.style.cursor = "move";
    }
  }

  private onMouseUp(e: MouseEvent) {
    this._engine.getRenderer().domElement.removeEventListener("mousemove", this._onMouseMoveBinded);
    this._engine.getRenderer().domElement.style.cursor = "default";
  }

  private onMouseMove(e: MouseEvent) {
    const camera = this._engine.getCamera();
    const mousePosition = this.getUnprojectCoordinates(e);

    const newPosition = mousePosition.clone().sub(this._firstPoint).multiplyScalar(-this.PAN_SPEED);

    camera.position.add(newPosition);

    this._firstPoint.copy(this.getUnprojectCoordinates(e));
  }

  enable(): void {
    if (!this._enabled) {
      this._engine.getRenderer().domElement.addEventListener("wheel", this._onWheelBinded);
      this._engine.getRenderer().domElement.addEventListener("mousedown", this._onMouseDownBinded);
      this._engine.getRenderer().domElement.addEventListener("mouseup", this._onMouseUpBinded);
      this._enabled = true;
    }
  }

  disable(): void {
    this._engine.getRenderer().domElement.removeEventListener("wheel", this._onWheelBinded);
    this._engine.getRenderer().domElement.removeEventListener("mousedown", this._onMouseDownBinded);
    this._engine.getRenderer().domElement.removeEventListener("mouseup", this._onMouseUpBinded);
    this._engine.getRenderer().domElement.removeEventListener("mousemove", this._onMouseMoveBinded);
    this._engine.getRenderer().domElement.style.cursor = "default";
    this._enabled = false;
  }
}
