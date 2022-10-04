import { TripletElement } from './Triplet';

export default class SimpleAssignment extends TripletElement {
  constructor() {
    super();
    this.operator = '=';
  }

  getAssigned() {
    return this.elements[0];
  }

  getValue() {
    return this.elements[1];
  }

  getTuple() {
    return [this.operator, this.getAssigned(), this.getValue()];
  }

  toString(): string {
    return `${this.getAssigned()} = ${this.getValue()};`;
  }

  clone() {
    const newSimpleAssigment = new SimpleAssignment();
    const [assigned, _operator, value] = this.getTuple();
    newSimpleAssigment.elements = [assigned, value];
    return newSimpleAssigment;
  }
}
