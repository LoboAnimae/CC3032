export interface IError {
  message: string;
  line: number;
  column: number;
}
type AnyObject = { [key: string]: any };

export class BasicStorage<T extends AnyObject> {
  public readonly elements: T[];
  constructor() {
    this.elements = [];
  }
  add = (error: T) => {
    if (this.exists(error)) return;
    this.elements.push(error);
  };
  exists = (error: T): boolean => {
    const requiredKeys = Object.keys(error);
    return this.elements.some((existingError) => {
      return requiredKeys.every((key) => {
        return existingError[key] === error[key];
      });
    });
  };
  getAll = (): T[] => this.elements;
  flush = () => {
    this.elements.length = 0;
  };
}
