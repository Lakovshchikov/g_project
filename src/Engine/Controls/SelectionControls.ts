import THREE, { type Mesh } from "three";
import { type IEngine } from "../Core/Interfaces/IEngine";
import { MouseControls } from "./Interfaces/MouseControls";
import { ENEMIES_GROUPS } from "../constants";
import { isISelectableObject } from "../utils";
import { type ISelectableObject } from "../Components/Interfaces/ISelectableObject";

export class SelectionControls extends MouseControls {
  private readonly _firstPoint: THREE.Vector3 = new THREE.Vector3();
  private readonly _raycaster = new THREE.Raycaster();
  private readonly _selectedObjectsCache = new Set<ISelectableObject>();
  private _section: Mesh | undefined;

  private readonly _onMouseMoveBinded: (e: MouseEvent) => void;
  private readonly _onMouseDownBinded: (e: MouseEvent) => void;
  private readonly _onMouseUpBinded: (e: MouseEvent) => void;

  constructor(engine: IEngine) {
    super(engine);

    this._onMouseMoveBinded = this.onMouseMove.bind(this);
    this._onMouseDownBinded = this.onMouseDown.bind(this);
    this._onMouseUpBinded = this.onMouseUp.bind(this);
  }

  enable(): void {
    if (!this._enabled) {
      this._engine.getRenderer().domElement.addEventListener("mousedown", this._onMouseDownBinded);
      this._engine.getRenderer().domElement.addEventListener("mouseup", this._onMouseUpBinded);
      this._enabled = true;
    }
  }

  disable(): void {
    this._engine.getRenderer().domElement.removeEventListener("mousedown", this._onMouseDownBinded);
    this._engine.getRenderer().domElement.removeEventListener("mouseup", this._onMouseUpBinded);
    this._engine.getRenderer().domElement.removeEventListener("mousemove", this._onMouseMoveBinded);
    this._enabled = false;
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.startMouseSelection(e);
      this.selectObject(e);
    }
  }

  private onMouseUp(e: MouseEvent) {
    if (this._section !== undefined) {
      this._engine.getSceneController().removeObjectFromScene(this._section);

      this._section = undefined;
    }

    this._engine.getRenderer().domElement.removeEventListener("mousemove", this._onMouseMoveBinded);
  }

  private onMouseMove(e: MouseEvent) {
    const mousePositionVector = this.getWorldCoordinates(e);

    if (this._section === undefined) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ color: "#3886c8", transparent: true, opacity: 0.3 });
      this._section = new THREE.Mesh(geometry, material);
      this._engine.getSceneController().addObjectToScene(this._section);
    }

    const scaleX = Math.abs(mousePositionVector.x - this._firstPoint.x);
    const scaleY = Math.abs(mousePositionVector.y - this._firstPoint.y);

    this._section.scale.set(scaleX, scaleY, 1);
    this._section.position.copy(this._firstPoint.clone().add(mousePositionVector).divideScalar(2));

    this.selectMultipleObjects();
  }

  private startMouseSelection(e: MouseEvent) {
    this._firstPoint.copy(this.getWorldCoordinates(e));

    this._engine.getRenderer().domElement.addEventListener("mousemove", this._onMouseMoveBinded);
  }

  private selectObject(e: MouseEvent) {
    const mouseCoords = this.getNormalizedCoordinates(e);
    const sceneController = this._engine.getSceneController();
    const selectableObjects = sceneController.getGroupByName(ENEMIES_GROUPS.SELECTABLE);

    if (selectableObjects !== undefined) {
      this._raycaster.setFromCamera(mouseCoords, this._engine.getCamera());
      let selectedObject;

      selectableObjects.forEach((object) => {
        if (isISelectableObject(object)) {
          if (this._raycaster.intersectObject(object.getObject()).length > 0) {
            object.enableSelectedStyles();
            selectedObject = object;
          }
        }
      });

      this._selectedObjectsCache.forEach((object) => {
        object.disableSelectedStyles();
      });
      this._selectedObjectsCache.clear();
      if (selectedObject !== undefined) {
        this._selectedObjectsCache.add(selectedObject);
      }
    }
  }

  private selectMultipleObjects() {
    const sceneController = this._engine.getSceneController();

    const selectableObjects = sceneController.getGroupByName(ENEMIES_GROUPS.SELECTABLE);

    if (selectableObjects !== undefined && this._section !== undefined) {
      this._section.geometry.computeBoundingBox();

      const selectionBbox = new THREE.Box3();
      selectionBbox.setFromObject(this._section);

      const newMinVector = new THREE.Vector3(selectionBbox.min.x, selectionBbox.min.y, 0);
      const newMaxVector = new THREE.Vector3(selectionBbox.max.x, selectionBbox.max.y, 1);
      selectionBbox.set(newMinVector, newMaxVector);

      selectableObjects.forEach((object) => {
        if (isISelectableObject(object) && this._section !== undefined) {
          const objectGeometry = object.getObject().geometry;
          objectGeometry.computeBoundingBox();

          const objectBbox = new THREE.Box3().setFromObject(object.getObject());

          if (objectBbox !== null && selectionBbox.intersectsBox(objectBbox)) {
            object.enableSelectedStyles();
            this._selectedObjectsCache.add(object);
          } else {
            object.disableSelectedStyles();
          }
        }
      });
    }
  }
}
