import CompositionComponent from '../Composition';
import SimpleOperation, { SimpleOperationOptions } from './SimpleOperation';

export default class AddOperation extends SimpleOperation {
  constructor() {
    super();
    this.operator = '+';
  }
  clone(): AddOperation {
    const newAddOperationInstance = new AddOperation();
    newAddOperationInstance.assigningTo = this.assigningTo;
    newAddOperationInstance.elements[0] = this.OPERAND1;
    newAddOperationInstance.elements[1] = this.OPERAND2;
    return newAddOperationInstance;
  }
}
