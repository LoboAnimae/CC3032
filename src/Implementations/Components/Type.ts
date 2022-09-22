import Composition from "./Composition";
import { DownUpHierarchy } from "./Hierarchy";

export interface TypeParams {
  name: string;
  isGeneric?: boolean;
  sizeInBytes: number;
  parent: TypeImpl | null;
}

export interface TypeComponent {
  isAncestorOf: (_incomingType?: Composition) => boolean;
  hasAsAncestor: (_incomingType?: Composition) => boolean;
  allowsAssignmentOf: (_incomingType?: Composition) => boolean;
  allowsComparisonTo: (_incomingType?: Composition) => boolean;
  coherseType: (_incomingType?: Composition, value?: any) => any;
}

/**
 * Unlike other components, the IType component
 * has a lot of logic inside of itself.
 * The idea is to create subsequent classes that inherit from this one
 */
export class TypeImpl extends Composition implements DownUpHierarchy<TypeImpl> {
  public name?: string;
  public isGeneric?: boolean;
  public sizeInBytes?: number;
  public parent: TypeImpl | null;

  constructor(options?: Partial<TypeParams> & Partial<TypeComponent>) {
    super({ componentName: "Type" });
    this.name = options?.name;
    this.isGeneric = options?.isGeneric ?? false;
    this.sizeInBytes = options?.sizeInBytes;
    this.parent = options?.parent ?? null;
  }

  setMethods(into: any, overrides?: Partial<TypeComponent>) {
    into.isAncestorOf = overrides?.isAncestorOf?.bind(into) ?? ((_incomingType?: TypeImpl) => false).bind(into);
    into.hasAsAncestor = overrides?.hasAsAncestor?.bind(into) ?? ((_incomingType?: TypeImpl) => false).bind(into);
    into.allowsAssignmentOf = overrides?.allowsAssignmentOf?.bind(into) ?? ((_incomingType?: TypeImpl) => false).bind(into);
    into.allowsComparisonTo = overrides?.allowsComparisonTo?.bind(into) ?? ((_incomingType?: TypeImpl) => false).bind(into);
    into.coherseType = overrides?.coherseType?.bind(into) ?? ((_incomingType?: TypeImpl, value?: any) => value).bind(into);
  }
}

export interface TypeSupport {
  components: { type: TypeImpl; };
}

export default TypeImpl;