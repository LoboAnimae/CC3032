import CompositionComponent from '../Composition';
import { QuadrupletElement } from '../index';

export interface SimpleOperationOptions {
  assigningTo: any;
}

export default abstract class SimpleOperation extends QuadrupletElement {
  assigningTo?: CompositionComponent;
  constructor() {
    super();
  }

  OPERAND1 = () => this.elements[0];
  OPERAND2 = () => this.elements[1];

  getTuple(): any[] {
    return [this.operator, this.OPERAND1(), this.OPERAND2];
  }

  toString(): string {
    return `AddOperation{ OPERAND1{ ${this.OPERAND1().toString()} }, OPERAND2{ ${this.OPERAND2().toString()} } }`;
  }
}
