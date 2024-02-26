import { type ISceneObject } from "../../Components/Interfaces/ISceneObject";

export interface ISceneObjectFactory {
  createObject: () => ISceneObject;
}
