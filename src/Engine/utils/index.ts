import { type Vector3 } from "three";

export * from "./typeguards";

export const roundVector3 = (vector: Vector3, digit: number) => {
  const e = Math.pow(10, Number.isNaN(digit) ? 0 : digit);
  vector.x = Math.round(vector.x * e) / e;
  vector.y = Math.round(vector.y * e) / e;
  vector.z = Math.round(vector.z * e) / e;
  return vector;
};

export const roundDigit = (value: number, digit: number) => {
  const e = Math.pow(10, Number.isNaN(digit) ? 0 : digit);
  return Math.round(value * e) / e;
};
