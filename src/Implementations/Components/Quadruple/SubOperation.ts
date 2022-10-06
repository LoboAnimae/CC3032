import SimpleOperation from './SimpleOperation';

export default class SubOperation extends SimpleOperation {
  constructor() {
    super();
    this.operator = '-';
  }
  clone(): SubOperation {
    const newAddOperationInstance = new SubOperation();
    newAddOperationInstance.assigningTo = this.assigningTo;
    newAddOperationInstance.elements[0] = this.OPERAND1;
    newAddOperationInstance.elements[1] = this.OPERAND2;
    return newAddOperationInstance;
  }

}
