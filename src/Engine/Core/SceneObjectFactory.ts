import { type ISceneObject } from "../Components/Interfaces/ISceneObject";
import { type ISceneObjectFactory } from "./Interfaces/ISceneObjectFactory";

export class SceneObjectFactory<SceneObject extends ISceneObject, Options extends Record<string, unknown> | undefined>
  implements ISceneObjectFactory
{
  private readonly _ObjectConstructor: new () => SceneObject;
  private readonly _options?: Options;

  constructor(ObjectConstructor: new () => SceneObject, options?: Options) {
    this._ObjectConstructor = ObjectConstructor;
    this._options = options;
  }

  createObject() {
    const object = new this._ObjectConstructor();

    this.setOptions(object);

    return object;
  }

  private setOptions(object: ISceneObject) {
    object.setOptions(this._options);
  }
}
