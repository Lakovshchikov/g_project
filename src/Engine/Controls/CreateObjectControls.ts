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

      const object = this._factory.createObject();
      const mesh = object.getObject();
      mesh.geometry.computeBoundingBox();

      const bbox = mesh.geometry.boundingBox;
      const height = (bbox?.max?.z ?? 0) - (bbox?.min.z ?? 0);
      pos.setZ(height);
      mesh.position.copy(pos);

      this._engine.getSceneController().addObjectToScene(mesh);
      this._engine.getSceneController().addObjectToGroups(object);
    }
  }
}
