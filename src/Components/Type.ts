import { ClassDefineContext } from 'antlr/yaplParser';
import {CompositionComponent} from '.';
import { DownUpHierarchy } from 'Interfaces';

export interface TypeParams {
  isGeneric?: boolean;
  sizeInBytes: number;
  parent: TypeComponent | null;
}

export interface TypeInstance {
  isAncestorOf: (_incomingType?: CompositionComponent) => boolean;
  hasAsAncestor: (_incomingType?: CompositionComponent) => boolean;
  allowsAssignmentOf: (_incomingType?: CompositionComponent) => boolean;
  allowsComparisonTo: (_incomingType?: CompositionComponent) => boolean;
  coherseType: (_incomingType?: CompositionComponent, value?: any) => any;
  createChild: () => TypeComponent;
}

export function extractTypeComponent(inComponent?: CompositionComponent | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<TypeComponent>({ componentType: TypeComponent.Type });
}

/**
 * A type component is a component that describes a type. It is the main component of a type system.
 */
export abstract class TypeComponent extends CompositionComponent implements DownUpHierarchy<TypeComponent> {
  static Name = 'Type';
  static Type = 'Type';
  readonly componentType = TypeComponent.Type;
  isGeneric?: boolean;
  sizeInBytes?: number;
  parent: TypeComponent | null;
  allowsNegation: boolean;
  defaultValue: any;

  constructor(options?: Partial<TypeParams> & Partial<TypeInstance>) {
    super();
    this.componentName = TypeComponent.Name;
    this.isGeneric = options?.isGeneric ?? false;
    this.sizeInBytes = options?.sizeInBytes;
    this.parent = options?.parent ?? null;
    this.allowsNegation = false;
    this.defaultValue = null;
  }

  readonly getHierarchy = (): TypeComponent[] => {
    return [...(this.parent?.getHierarchy() ?? []), this];
  };

  readonly isAncestorOf = (incomingType?: CompositionComponent) => {
    const typeComponent = incomingType?.getComponent<TypeComponent>(
      { componentType: incomingType?.componentType },
      { currentScope: true },
    );
    if (!typeComponent) return false;
    return typeComponent.inheritsFrom(this);
  };

  readonly inheritsFrom = (incomingType?: CompositionComponent) => {
    const hierarchyChainNames = this.getHierarchy()
      .map((t) => t.componentName)
      .filter((t) => t !== this.componentName);

    // Don't grab only in the current scope because inherited types are allowed
    const incomingTypeComponent = incomingType?.getComponent<TypeComponent>({
      componentType: TypeComponent.Type,
    })?.componentName;

    return hierarchyChainNames.includes(incomingTypeComponent ?? '');
  };

  abstract allowsAssignmentOf: (_incomingType?: CompositionComponent) => boolean;
  abstract allowsComparisonTo: (_incomingType?: CompositionComponent) => boolean;
  abstract coherseType: (_incomingType?: CompositionComponent, value?: any) => any;
  abstract createChild: (context: ClassDefineContext) => TypeComponent;
}

export interface TypeSupport {
  components: { type: TypeComponent };
}
