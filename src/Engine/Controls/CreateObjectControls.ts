import THREE from "three";
import { type IEngine } from "../Core/Interfaces/IEngine";
import { type ISceneObjectFactory } from "../Core/Interfaces/ISceneObjectFactory";
import { MouseControls } from "./Interfaces/MouseControls";

export class CreateObjectControls extends MouseControls {
  private readonly _factory: ISceneObjectFactory;
  private readonly _onMouseDownBinded: (e: MouseEvent) => void;

  constructor(engine: IEngine, factory: ISceneObjectFactory) {
    super(engine);

    this._factory = factory;
    this._onMouseDownBinded = this.onMouseDown.bind(this);
  }

  enable(): void {
    if (!this._enabled) {
      this._engine.getRenderer().domElement.addEventListener("mousedown", this._onMouseDownBinded);
      this._enabled = true;
    }
  }

  disable(): void {
    this._engine.getRenderer().domElement.removeEventListener("mousedown", this._onMouseDownBinded);
    this._enabled = false;
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      const mousePosition = this.getWorldCoordinates(e);

      const dir = mousePosition.sub(this._engine.getCamera().position).normalize();
      const distance = -this._engine.getCamera().position.z / dir.z;
      const pos = this._engine.getCamera().position.clone().add(dir.multiplyScalar(distance));
      pos.setZ(0);

      const object = this._factory.createObject();
      object.getObject().position.copy(pos);

      const helper = new THREE.Box3Helper(new THREE.Box3().setFromObject(object.getObject()), 0xffff00);
      this._engine.getSceneController().addObjectToScene(helper);

      this._engine.getSceneController().addObjectToScene(object.getObject());
      this._engine.getSceneController().addObjectToGroup(object);
    }
  }
}
