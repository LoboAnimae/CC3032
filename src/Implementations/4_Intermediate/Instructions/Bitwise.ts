import Quadruple from './Quadruple';

interface IBitwise {
  saveIn: any;
  toNegate: any;
  comment?: string;
}

export class NOT extends Quadruple {
  operator: string = '~';
  operatorVerbose: string = 'NOT';
  constructor(options: IBitwise) {
    const { saveIn: dest, toNegate: src1, comment } = options;
    super({ dest, src1, comment });
  }
  toMIPS(): string {
    return `\t\t${this.operatorVerbose} ${this.DESTINATION()}, ${this.OPERAND1()}`;
  }
  toString(): string {
    return `\t\t${this.DESTINATION()} = ${this.operator}${this.OPERAND1()}`;
  }
  calculateComment(): string {
    return '';
  }
}
