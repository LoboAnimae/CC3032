import {SimpleOperation} from './SimpleOperation';

export class DivOperation extends SimpleOperation {
  constructor() {
    super();
    this.operator = '/';
  }
  clone(): DivOperation {
    const newAddOperationInstance = new DivOperation();
    newAddOperationInstance.assigningTo = this.assigningTo;
    newAddOperationInstance.elements[0] = this.OPERAND1;
    newAddOperationInstance.elements[1] = this.OPERAND2;
    return newAddOperationInstance;
  }
}
