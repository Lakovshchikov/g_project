import THREE, { type Scene } from "three";
import { type ISceneController } from "./Interfaces/ISceneController";
import { type ISceneObject } from "../Components/Interfaces/ISceneObject";

export class SceneController implements ISceneController {
  private readonly _scene: Scene;
  private readonly _objectGroupsMap = new Map<string, Set<ISceneObject>>();

  constructor() {
    this._scene = new THREE.Scene();
    this.initGrid();
  }

  getScene() {
    return this._scene;
  }

  getGroupByName(groupName: string) {
    return this._objectGroupsMap.get(groupName);
  }

  addObjectToScene(object: THREE.Object3D) {
    this._scene.add(object);
  }

  removeObjectFromScene(object: THREE.Object3D) {
    this._scene.remove(object);
  }

  addObjectToGroup(object: ISceneObject, groups: string[] = []) {
    const objectGroups = object.getGroups();
    const allGroups = Array.from(new Set([...objectGroups, ...groups]));

    allGroups.forEach((groupName) => {
      let group = this._objectGroupsMap.get(groupName);
      if (group != null) {
        group.add(object);
      } else {
        group = new Set();
        group.add(object);
        this._objectGroupsMap.set(groupName, group);
      }
    });
  }

  removeObjectFromGroup(object: ISceneObject, groups: string[] = []) {
    const objectGroups = object.getGroups();
    const allGroups = Array.from(new Set([...objectGroups, ...groups]));

    allGroups.forEach((groupName) => {
      const group = this._objectGroupsMap.get(groupName);
      if (group != null) {
        group.delete(object);
      }
    });
  }

  removeObjectFromAllGroups(object: ISceneObject) {
    this._objectGroupsMap.forEach((group) => {
      group.delete(object);
    });
  }

  private initGrid() {
    const size = 100;
    const divisions = 100;

    const gridHelper = new THREE.GridHelper(size, divisions, new THREE.Color("white"), new THREE.Color("white"));
    gridHelper.rotateX(Math.PI / 2);
    gridHelper.position.y = 0;

    this._scene.add(gridHelper);
    this._scene.add(new THREE.AxesHelper(100));
  }
}
