import Composition from "./Composition";
import { DownUpHierarchy } from "./Hierarchy";

export interface TypeParams {
  name: string;
  isGeneric?: boolean;
  sizeInBytes: number;
  parent: TypeComponent | null;
}

export interface TypeInstance {
  isAncestorOf: (_incomingType?: Composition) => boolean;
  hasAsAncestor: (_incomingType?: Composition) => boolean;
  allowsAssignmentOf: (_incomingType?: Composition) => boolean;
  allowsComparisonTo: (_incomingType?: Composition) => boolean;
  coherseType: (_incomingType?: Composition, value?: any) => any;
  createChild: () => TypeComponent;
}

/**
 * Unlike other components, the IType component
 * has a lot of logic inside of itself.
 * The idea is to create subsequent classes that inherit from this one
 */
export class TypeComponent extends Composition implements DownUpHierarchy<TypeComponent> {
  public name?: string;
  public isGeneric?: boolean;
  public sizeInBytes?: number;
  public parent: TypeComponent | null;

  constructor(options?: Partial<TypeParams> & Partial<TypeInstance>) {
    super({ componentName: "Type" });
    this.name = options?.name;
    this.isGeneric = options?.isGeneric ?? false;
    this.sizeInBytes = options?.sizeInBytes;
    this.parent = options?.parent ?? null;
  }

  getHierarchy(): TypeComponent[] {
    return [...(this.parent?.getHierarchy() ?? []), this];
  }

  copy(): TypeComponent {
    return new TypeComponent({
      name: this.name,
      isGeneric: this.isGeneric,
      sizeInBytes: this.sizeInBytes,
      parent: this.parent,
    });
  }

  isAncestorOf = (incomingType?: Composition) => {
    const typeComponent = incomingType?.getComponent(TypeComponent);
    if (!typeComponent) return false;
    return typeComponent.hasAsAncestor(this);
  };
  hasAsAncestor = (_incomingType?: Composition) => {
    const hierarchyChain = this.getHierarchy().map(t => t.name).filter( t => t !== this.name);
    if (_incomingType instanceof TypeComponent) {
      return hierarchyChain.includes(_incomingType.name);
    }
    return hierarchyChain.includes(_incomingType?.getComponent(TypeComponent)?.name);
  };
  allowsAssignmentOf = (_incomingType?: Composition) => false;
  allowsComparisonTo = (_incomingType?: Composition) => false;
  coherseType = (_incomingType?: Composition, value?: any) => value;
  createChild = () => new TypeComponent({ parent: this });

  configure(into: any): void {
    this.setMethods(into);
  }

  setMethods(into: any, overrides?: Partial<TypeInstance>) {
    into.isAncestorOf = overrides?.isAncestorOf?.bind(into) ?? ((_incomingType?: TypeComponent) => false).bind(into);
    into.hasAsAncestor = overrides?.hasAsAncestor?.bind(into) ?? ((_incomingType?: TypeComponent) => false).bind(into);
    into.allowsAssignmentOf =
      overrides?.allowsAssignmentOf?.bind(into) ?? ((_incomingType?: TypeComponent) => false).bind(into);
    into.allowsComparisonTo =
      overrides?.allowsComparisonTo?.bind(into) ?? ((_incomingType?: TypeComponent) => false).bind(into);
    into.coherseType =
      overrides?.coherseType?.bind(into) ?? ((_incomingType?: TypeComponent, value?: any) => value).bind(into);
    into.createChild = overrides?.createChild?.bind(into) ?? (() => new TypeComponent({ parent: this })).bind(into);
  }
}

export interface TypeSupport {
  components: { type: TypeComponent };
}

export default TypeComponent;
