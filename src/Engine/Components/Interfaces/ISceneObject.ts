import { type Mesh } from "three";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ISceneObject<Options = {}> {
  getObject: () => Mesh;
  getGroups: () => string[];
  setOptions: (options?: Options) => void;
}
