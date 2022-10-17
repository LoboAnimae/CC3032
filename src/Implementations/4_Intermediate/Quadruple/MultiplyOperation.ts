import { SimpleOperation } from './SimpleOperation';

export class MultiplyOperation extends SimpleOperation {
  constructor() {
    super();
    this.operator = '*';
  }
  clone(): MultiplyOperation {
    const newAddOperationInstance = new MultiplyOperation();
    newAddOperationInstance.assigningTo = this.assigningTo;
    newAddOperationInstance.elements[0] = this.OPERAND1;
    newAddOperationInstance.elements[1] = this.OPERAND2;
    return newAddOperationInstance;
  }

  toCode(): string {
    return `${this.getTemporal()} = ${this.OPERAND1().getTemporal()} ${this.operator} ${this.OPERAND2().getTemporal()}`;
  }
}
