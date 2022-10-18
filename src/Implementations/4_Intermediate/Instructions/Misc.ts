import { JUMP_BACK, JUMP_LINK_REGISTER } from '../../../Components/TemporaryValues';
import Quadruple, { Quad } from './Quadruple';

export class Return extends Quadruple {
  operator: string = '';
  operatorVerbose: string = 'return';
  calculateComment(): string {
    this.comment = 'return';
    return this.comment;
  }
  toMIPS(): string {
    return this.withComment(`\t\t${new JUMP_BACK()}\t${new JUMP_LINK_REGISTER()}`);
  }

  toString(): string {
    return this.withComment(`\t\t${this.operatorVerbose}`);
  }

  toTuple(): Quad {
    return ['', this.operatorVerbose, null, null];
  }
}

export class SysCall extends Quadruple {
  operator: string = '';
  operatorVerbose: string = 'syscall';
  constructor() {
    super();
  }
  calculateComment(): string {
    this.comment = 'Call for the system';
    return this.comment;
  }

  toMIPS(): string {
    return this.withComment('\t\t' + this.operatorVerbose);
  }

  toString(): string {
    return this.withComment(`\t\t${this.operatorVerbose}`);
  }

  toTuple(): Quad {
    return ['', this.operatorVerbose, null, null];
  }
}

export class MethodDeclaration extends Quadruple {
  operator: string = '';
  operatorVerbose: string = '';
  constructor(name: string, comment?: string) {
    super({ src1: name, comment });
  }
  calculateComment(): string {
    // this.comment = 'Method declaration for ' + this.OPERAND1() + '\n';
    this.comment = '';
    return this.comment;
  }

  toMIPS(): string {
    return this.withComment(`${this.OPERAND1()}:`);
  }

  toString(): string {
    return this.withComment(`${this.OPERAND1()}:`);
  }

  toTuple(): Quad {
    return ['', `${this.operatorVerbose} ${this.OPERAND1()}`, null, null];
  }
}

export class TextHolder extends Quadruple {
  operator: string = '';
  operatorVerbose: string = '';
  constructor(contents: string, comment?: string) {
    super({ src1: contents, comment });
  }
  calculateComment(): string {
    return '';
  }

  toMIPS(): string {
    return this.withComment(`${this.OPERAND1()}`);
  }

  toString(): string {
    return this.withComment(`${this.OPERAND1()}`);
  }

  toTuple(): Quad {
    return ['', this.OPERAND1(), null, null];
  }
}

export class Comment extends Quadruple {
  operator: string = '';
  operatorVerbose: string = '';
  constructor(contents: string) {
    super({ src1: contents });
  }
  calculateComment(): string {
    return '';
  }

  toMIPS(): string {
    return '';
  }

  toString(): string {
    return `#\t${this.OPERAND1()}`;
  }

  toTuple(): Quad {
    return ['', this.OPERAND1(), null, null];
  }
}
