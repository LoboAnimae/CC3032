import ComponentInformation from './ComponentInformation';
import Composition from './Composition';


export function extractQuadruple(inComponent?: Composition | null): QuadrupleComponent | null {
  if (!inComponent) return null;
  const { Quadruple } = ComponentInformation.components;
  return inComponent.getComponent<QuadrupleComponent>({ componentType: Quadruple.type });
}

class QuadrupleElement {
  operator: string | null;
  elements: [string | null, string | null];

  constructor() {
    this.operator = null;
    this.elements = [null, null];
  }

}

interface IQuadrupleComponentOptions {
  initialValues: QuadrupleElement[];
}

class QuadrupleComponent extends Composition {
  private readonly _elements: QuadrupleElement[];


  constructor(options?: IQuadrupleComponentOptions) {
    super();
    this._elements = [];
    if (options) {
      for (const initialValue of options.initialValues) {
        const operator = initialValue.operator;
        const [element1, element2] = initialValue.elements;
        this._elements.push({ operator, elements: [element1, element2] });
      }
    }
  }

  copyElements() {
    return [...this._elements];
  }
  merge(...components: Composition[]): void {
    for (const component of components) {
      const quadrupleComponent = extractQuadruple(component);
      if (!quadrupleComponent) continue;
      const copiedElements = quadrupleComponent.copyElements();
      this._elements.push(...copiedElements);
    }
  }

  clone(): Composition {
    return new QuadrupleComponent();
  }
}
