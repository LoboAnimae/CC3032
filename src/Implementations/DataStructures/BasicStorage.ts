import { IBasicStorageOptions } from "../../Interfaces";
import { AnyObject } from "../../Types";


export class BasicStorage<T extends AnyObject> {
  public readonly elements: T[];
  unique: boolean;
  constructor(options?: IBasicStorageOptions) {
    this.elements = [];
    this.unique = options?.unique ?? false;
  }
  add = (element: T) => {
    if (this.unique && this.exists(element)) return;
    this.elements.push(element);
  };
  exists = (element: T): boolean => {
    const requiredKeys = Object.keys(element);
    return this.elements.some((existingElement) => {
      return requiredKeys.every((key) => {
        return existingElement[key] === element[key];
      });
    });
  };
  getAll = (): T[] => [...this.elements];
  flush = () => {
    this.elements.length = 0;
  };
}
