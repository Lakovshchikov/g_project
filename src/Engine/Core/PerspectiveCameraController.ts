import THREE from "three";

import { type ICameraController } from "./Interfaces/ICameraController";

interface CtorParams {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

const DEFAULT_PARAMS: CtorParams = {
  fov: 90,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
};

export class PerspectiveCameraController implements ICameraController<THREE.PerspectiveCamera> {
  private readonly _camera: THREE.PerspectiveCamera;

  constructor(cameraParams = DEFAULT_PARAMS) {
    this._camera = new THREE.PerspectiveCamera(
      cameraParams.fov,
      cameraParams.aspect,
      cameraParams.near,
      cameraParams.far,
    );
    return this;
  }

  getCamera() {
    return this._camera;
  }
}
