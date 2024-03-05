import { type ISceneObject } from "@/Engine/Components/Interfaces/ISceneObject";
import type THREE from "three";
import { type Object3D } from "three";

export interface ISceneController {
  getScene: () => THREE.Scene;

  getGroupByName: (groupName: string) => Set<ISceneObject> | undefined;

  addObjectToScene: (object: Object3D) => void;

  removeObjectFromScene: (object: Object3D) => void;

  addObjectToGroups: (object: ISceneObject, groups?: string[]) => void;

  removeObjectFromGroups: (object: ISceneObject, groups?: string[]) => void;

  removeObjectFromAllGroups: (object: ISceneObject) => void;
}
