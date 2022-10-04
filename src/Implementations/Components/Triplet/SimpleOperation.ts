import CompositionComponent from '../Composition';
import { TripletElement } from '../index';

export interface SimpleOperationOptions {
  assigningTo: any;
}

export default abstract class SimpleOperation extends TripletElement {
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
    return `${this.assigningTo} = ${this.OPERAND1()} ${this.operator} ${this.OPERAND2()}`;
  }
}
