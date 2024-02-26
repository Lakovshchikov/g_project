export interface ISelectableObject {
  selectable: () => boolean;
  enableSelectedStyles: () => void;
  disableSelectedStyles: () => void;
}
