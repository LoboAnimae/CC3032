import SimpleOperation from './SimpleOperation';

export default class MultOperation extends SimpleOperation {
  constructor() {
    super();
    this.operator = '*';
  }
  clone(): MultOperation {
    const newAddOperationInstance = new MultOperation();
    newAddOperationInstance.assigningTo = this.assigningTo;
    newAddOperationInstance.elements[0] = this.OPERAND1;
    newAddOperationInstance.elements[1] = this.OPERAND2;
    return newAddOperationInstance;
  }

}
