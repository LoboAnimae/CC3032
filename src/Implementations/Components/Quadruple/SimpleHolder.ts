import CompositionComponent from '../Composition';
import { QuadrupletElement } from './Quadruple';

export default class SimpleHolder extends QuadrupletElement {
  constructor() {
    super();
    this.operator = '=';
  }

  getTuple(): any[] {
    return [this.operator, this.elements[0], undefined, this.getTemporal()];
  }
  clone(): SimpleHolder {
    const newSimpleHolder = new SimpleHolder();
    newSimpleHolder.elements = [...this.elements];
    return newSimpleHolder;
  }

  setValue(newValue: any) {
    this.elements[0] = newValue;
  }

  toString(): string {
    return `SimpleHolder{ ${this.elements[0].memoryAddress?.() ?? this.elements[0].toString()} }`;
  }

  toCode(): string {
    return `${this.getTemporal()} ${this.operator} ${this.elements[0]}`
  }
}
