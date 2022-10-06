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
  toCode(): string {
    const operand1 = this.OPERAND1();
    const operand2 = this.OPERAND2();
    const operand1Val = operand1?.getTemporal?.() ?? operand1?.toCode?.() ?? operand1?.toString?.()
    const operand2Val = operand2?.getTemporal?.() ?? operand2?.toCode?.() ?? operand2?.toString?.()
      return `${this.getTemporal()} = ${operand1Val} ${this.operator} ${operand2Val}`;
  }
}
