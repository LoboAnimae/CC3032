import ComponentInformation from '../ComponentInformation';
import Composition from '../Composition';
import CompositionComponent from '../Composition';
import { v4 as uuid } from 'uuid';


export function extractTriplet(inComponent?: Composition | null): TripletElement | null {
  if (!inComponent) return null;
  const { Quadruple } = ComponentInformation.components;
  return inComponent.getComponent<TripletElement>({ componentType: Quadruple.element });
}

export abstract class TripletElement extends Composition {
  readonly id: string;
  operator: string | null;
  elements: [string | null, string | null];

  constructor() {
    super();
    this.componentType = ComponentInformation.components.Quadruple.element;
    this.id = uuid();
    this.operator = null;
    this.elements = [null, null];
  }


  ID = () => this.id;

  toString(): string {
    return `<${this.id}> = ${this.elements[0]} ${this.operator ?? ''} ${this.elements[1] ?? ''}`.trim() + ';';
  }

  abstract getTuple(): any[];
}

export default class Triplet extends Composition {

  private readonly _elements: TripletElement[];


  constructor() {
    super();
    this._elements = [];
  }

  copyElements(): TripletElement[] {
    return this._elements.map((el: TripletElement) => el.copy()) as TripletElement[];
  }

  add(...quadruples: TripletElement[]): void {
    this._elements.push(...quadruples);
  }

  merge(...components: Composition[]): void {
    for (const component of components) {
      const tripletComponent: TripletElement | null = extractTriplet(component);
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
      stringResults.push({operator, Operand1, Operand2});
    }
    console.table(stringResults)
  }

  clone(): CompositionComponent {
    throw new Error('Can\'t clone a triplet');
  }
}
