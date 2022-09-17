export interface IFilePosition {
  fileName: string;
  line: number;
  column: number;
}

export interface IBasicInfo<T = string> {
  name: string;
  type: T;
}

export interface ISizeInfo {
  size: number;
}
