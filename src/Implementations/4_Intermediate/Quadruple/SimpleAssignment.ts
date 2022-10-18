import { QuadrupletElement } from 'Components';

export class SimpleAssignment extends QuadrupletElement {
  constructor() {
    super();
    this.operator = '=';
  }

  getValue() {
    return this.elements[1];
  }

  setValue(newVal: any) {
    this.elements[1] = newVal;
  }

  getAssigningTo() {
    return this.elements[0] ?? this.getTemporal();
  }
  setAssigningTo(assigningTo: any) {
    this.elements[0] = assigningTo;
  }

  getTuple() {
    return [this.operator, this.getTemporal(), this.getValue()];
  }

  toString(): string {
    return `SimpleAssignment{ ${this.getValue()} }`;
  }

  clone() {
    const newSimpleAssigment = new SimpleAssignment();
    const [assigned, _operator, value] = this.getTuple();
    newSimpleAssigment.elements = [assigned, value];
    return newSimpleAssigment;
  }

  toCode(): string {
    if (process.env.DEBUG) {
      return `AddOperation{ OPERAND1{ ${this.getAssigningTo().toString()} }, OPERAND2{ ${this.getValue().toString()} } }`;
    }
    const val = this.getValue();
    const value = val.getTemporal?.() ?? val.toCode?.() ?? val.toString?.();

    return `${this.getAssigningTo().toCode()} ${this.operator} ${value}`;
  }
}
