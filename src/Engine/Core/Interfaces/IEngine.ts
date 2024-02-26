import type * as THREE from "three";
import { type ISceneController } from "./ISceneController";

export interface IEngine<Camera extends THREE.Camera = THREE.PerspectiveCamera> {
  getCamera: () => Camera;
  getSceneController: () => ISceneController;
  getRenderer: () => THREE.Renderer;
  render: () => void;
}
