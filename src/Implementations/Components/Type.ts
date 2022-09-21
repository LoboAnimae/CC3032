import { DownUpHierarchy } from "./Hierarchy";

export interface Params {
  name: string;
  isGeneric?: boolean;
  sizeInBytes: number;
  parent: Component | null;
}

/**
 * Unlike other components, the IType component
 * has a lot of logic inside of itself.
 * The idea is to create subsequent classes that inherit from this one
 */
export class Component implements DownUpHierarchy<Component> {
  public name?: string;
  public isGeneric?: boolean;
  public sizeInBytes?: number;
  public parent: Component | null;

  constructor(options?: Partial<Params>) {
    this.name = options?.name;
    this.isGeneric = options?.isGeneric ?? false;
    this.sizeInBytes = options?.sizeInBytes;
    this.parent = options?.parent ?? null;
  }

  isAncestorOf(_incomingType?: Component): boolean {
    return false;
  }
  hasAsAncestor(_incomingType?: Component): boolean {
    return false;
  }
  allowsAssignmentOf(_incomingType?: Component): boolean {
    return false;
  }
  allowsComparisonTo(_incomingType?: Component): boolean {
    return false;
  }
  coherseType(_incomingType?: Component, value?: any): any | null {
    return value;
  }
}

export type Type = Component;

export interface Support {
  components: { type: Component };
  getTypeComponent(): Component;
  setTypeComponent(newComponent: Component): void;
}
