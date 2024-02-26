import { type ISceneObject } from "../Components/Interfaces/ISceneObject";
import { type ISelectableObject } from "../Components/Interfaces/ISelectableObject";

export function isISelectableObject<O>(object: O): object is O & ISelectableObject {
  return object !== null && typeof object === "object" && "selectable" in object;
}

export function isISceneObject<O extends THREE.Object3D>(object: O): object is O & ISceneObject {
  return object !== null && typeof object === "object" && "selectable" in object;
}
