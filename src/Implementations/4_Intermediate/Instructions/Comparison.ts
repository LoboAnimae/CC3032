import { Quadruple } from './Quadruple';

interface IComparison {
  fistOperand: any;
  secondOperand: any;
  comment?: string;
  goTo?: string;
}

abstract class COMPARISON extends Quadruple {
  constructor(options: IComparison) {
    const { fistOperand: src1, secondOperand: src2, comment, goTo: dest } = options;
    super({ src1, src2, dest, comment });
  }

  toMIPS(): string {
    return `\t\t${this.operatorVerbose}, ${this.OPERAND1()}, ${this.OPERAND2()}, ${this.DESTINATION()}`;
  }

  toString(): string {
    return `\t\tif (${this.OPERAND1()} ${this.OPERAND()} ${this.OPERAND2()}) goto ${this.DESTINATION()}`;
  }
}

export class EQUAL extends COMPARISON {
  operator: string = '==';
  operatorVerbose: string = 'beq';
  calculateComment(): string {
    return '';
  }
}

export class LESSEQUAL extends COMPARISON {
  operator: string = '<=';
  operatorVerbose: string = 'ble';
  calculateComment(): string {
    return '';
  }
}

export class LESSTHAN extends COMPARISON {
  operator: string = '<';
  operatorVerbose: string = 'blt';
  calculateComment(): string {
    return '';
  }
}
