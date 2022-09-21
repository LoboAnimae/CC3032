export interface DownUpHierarchy<T> {
  parent: T | null;
}

export interface UpDownHierarchy<T> {
  children: T[];
}

export interface Hierarchy<T> extends DownUpHierarchy<T>, UpDownHierarchy<T> {}
