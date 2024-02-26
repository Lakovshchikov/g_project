import THREE from "three";
import { type IEngine } from "../../Core/Interfaces/IEngine";

export abstract class MouseControls {
  protected readonly _engine: IEngine;
  protected _enabled: boolean = false;

  constructor(engine: IEngine) {
    this._engine = engine;
  }

  get enabled(): boolean {
    return this.enabled;
  }

  protected getNormalizedCoordinates(e: MouseEvent) {
    return new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  }

  protected getWorldCoordinates(e: MouseEvent) {
    const { x, y } = this.getNormalizedCoordinates(e);

    const mouseCoords = new THREE.Vector3();

    const directionVector = new THREE.Vector3(x, y, 0);
    directionVector.unproject(this._engine.getCamera());
    directionVector.sub(this._engine.getCamera().position).normalize();

    const distance = -this._engine.getCamera().position.z / directionVector.z;

    mouseCoords.copy(this._engine.getCamera().position).add(directionVector.multiplyScalar(distance));

    return mouseCoords;
  }

  protected getUnprojectCoordinates(e: MouseEvent) {
    const { x, y } = this.getNormalizedCoordinates(e);

    return new THREE.Vector3(x, y).unproject(this._engine.getCamera());
  }

  abstract enable(): void;
  abstract disable(): void;
}
