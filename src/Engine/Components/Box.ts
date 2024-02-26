import * as THREE from "three";
import { type IEnemy } from "./Interfaces/IEnemy";
import { type ISelectableObject } from "./Interfaces/ISelectableObject";

interface BoxOptions {
  groups?: string[];
}

const DEFAULT_OPTIONS: Required<BoxOptions> = {
  groups: [],
};

export class Box implements IEnemy<BoxOptions>, ISelectableObject {
  private readonly _selectable = true;
  private readonly _object: THREE.Mesh;

  private readonly _defaultGroups = ["BOX"];
  private _groups: string[] = [];

  private readonly BASE_OBJECT_MATERIAL = new THREE.MeshBasicMaterial({ color: new THREE.Color("#b2dfdb") });
  private readonly SELECTED_OBJECT_MATERIAL = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff3333") });

  constructor(options?: BoxOptions) {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    this._object = new THREE.Mesh(geometry, this.BASE_OBJECT_MATERIAL);
    this.setOptions(options);
  }

  setOptions(options?: BoxOptions) {
    this._groups = options?.groups !== undefined ? options.groups : DEFAULT_OPTIONS.groups;
  }

  getObject() {
    return this._object;
  }

  getGroups() {
    return Array.from(new Set([...this._defaultGroups, ...this._groups]));
  }

  enableSelectedStyles() {
    this._object.material = this.SELECTED_OBJECT_MATERIAL;
  }

  disableSelectedStyles() {
    this._object.material = this.BASE_OBJECT_MATERIAL;
  }

  selectable() {
    return this._selectable;
  }
}
