import ComponentInformation from './ComponentInformation';
import Composition from './Composition';
import { v4 as uuid } from 'uuid';
import { QuadrupleComponent } from './index';


export function extractQuadruple(inComponent?: Composition | null): Quadruple | null {
  if (!inComponent) return null;
  const { Quadruple } = ComponentInformation.components;
  return inComponent.getComponent<Quadruple>({ componentType: Quadruple.type });
}

interface IQuadrupleElementOptions {
  id?: string;
  operator?: string;
  elements?: [string | null, string | null];
}

export class QuadrupleElement extends Composition {
  id: string;
  operator: string | null;
  elements: [string | null, string | null];

  constructor(options?: IQuadrupleElementOptions) {
    super();
    this.componentType = 'QuadrupleElement';
    this.id = options?.id ?? uuid();
    this.operator = options?.operator ?? null;
    this.elements = [...(options?.elements ?? [null, null])];
  }

  clone() {
    const operator = this.operator as string;
    const [element1, element2] = this.elements;
    return new QuadrupleElement({ operator, elements: [element1, element2] });
  }

  toString(): string {
    return `<${this.componentType}> | <${this.id}> = ${this.elements[0]} ${this.operator ?? ''} ${this.elements[1] ?? ''}`.trim() + ';';
  }

}

interface IQuadrupleComponentOptions {
  initialValues: QuadrupleElement[];
}

export default class Quadruple extends Composition {
  private readonly _elements: QuadrupleElement[];


  constructor(options?: IQuadrupleComponentOptions) {
    super();
    this._elements = [];
    if (options) {
      for (const initialValue of options.initialValues) {
        const operator = initialValue.operator as string;
        const [element1, element2] = initialValue.elements;
        this._elements.push(new QuadrupleElement({ operator, elements: [element1, element2] }));
      }
    }
  }

  copyElements(): QuadrupleElement[] {
    return this._elements.map((el: QuadrupleElement) => el.copy()) as QuadrupleElement[];
  }

  add(...quadruples: QuadrupleElement[]): void {
    this._elements.push(...quadruples);
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
    return new Quadruple();
  }
}
