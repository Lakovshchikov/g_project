import { type Camera } from "three";

export interface ICameraController<CameraType extends Camera> {
  getCamera: () => CameraType;
}
