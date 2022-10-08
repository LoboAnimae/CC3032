
import Composition from '../Composition';
import CompositionComponent from '../Composition';
import { v4 as uuid } from 'uuid';
import TemporalComponent from '../TemporalComponent';

export function extractQuadruplet(inComponent?: Composition | null): QuadrupletElement | null {
  if (!inComponent) return null;
  return inComponent.getComponent<QuadrupletElement>({ componentType: QuadrupletElement.Type });
}

export abstract class QuadrupletElement extends Composition {
  static Name = 'QuadrupletElement';
  static Type = 'QuadrupletElement';
  readonly id: string;
  operator: string | null;
  temporal: TemporalComponent;
  elements: [any, any];

  constructor() {
    super();
    this.componentType = QuadrupletElement.Type;
    this.id = uuid();
    this.operator = null;
    this.elements = [null, null];
    this.temporal = new TemporalComponent();
  }

  ID = () => this.id;

  toString(): string {
    return `<${this.id}> = ${this.elements[0]} ${this.operator ?? ''} ${this.elements[1] ?? ''}`.trim() + ';';
  }

  abstract getTuple(): any[];
  getTemporal = () => this.temporal;
  abstract toCode(): string;
}

export default class Quadruplet extends Composition {
  static Name = 'Quadruplet';
  static Type = 'QuadrupletComponent';
  private readonly _elements: QuadrupletElement[];

  constructor() {
    super();
    this._elements = [];
    this.componentName = Quadruplet.Name;
    this.componentType = Quadruplet.Type;
  }

  copyElements(): QuadrupletElement[] {
    return this._elements.map((el: QuadrupletElement) => el.copy()) as QuadrupletElement[];
  }

  add(...quadruples: QuadrupletElement[]): void {
    this._elements.push(...quadruples);
  }

  merge(...components: Composition[]): void {
    for (const component of components) {
      const tripletComponent: QuadrupletElement | null = extractQuadruplet(component);
      if (!tripletComponent) continue;
      this._elements.push(tripletComponent);
    }
  }

  toString(): string {
    const stringResults = [];
    for (const triple of this._elements) {
      stringResults.push(triple.toString());
    }
    return stringResults.join('\n');
  }

  printTable(): void {
    const stringResults = [];
    for (const triple of this._elements) {
      const [operator, Operand1, Operand2] = triple.getTuple();
      stringResults.push({ operator, Operand1: Operand1?.toString(), Operand2: Operand2?.toString() });
    }
    console.table(stringResults);
  }

  clone(): CompositionComponent {
    throw new Error("Can't clone a triplet");
  }
}
