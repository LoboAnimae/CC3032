import Quadruple, { Quad } from "./Quadruple";

export class UnconditionalJump extends Quadruple {
    operator: string = '';
    operatorVerbose: string = 'j';
    constructor(towards: string) {
      super({ src1: towards });
    }
    calculateComment(): string {
      this.comment = 'Inconditional jump';
      return this.comment;
    }
  
    toMIPS(): string {
      return this.withComment(`\t\t${this.operatorVerbose}\t${this.OPERAND1()}`);
    }
  
    toString(): string {
      return this.withComment(`\t\t${this.operatorVerbose}\t${this.OPERAND1()}`);
    }
  
    toTuple(): Quad {
      return ['', `${this.operatorVerbose} ${this.OPERAND1()}`, null, null];
    }
  }
  
  export class LinkedJump extends Quadruple {
    operator: string = '';
    operatorVerbose: string = 'jal';
    constructor(towards: string, comment?: string) {
      super({ src1: towards, comment });
    }
    calculateComment(): string {
      this.comment = 'Jump with link';
      return this.comment;
    }
  
    toMIPS(): string {
      return this.withComment(`\t\t${this.operatorVerbose}\t${this.OPERAND1()}`);
    }
  
    toString(): string {
      return this.withComment(`\t\t${this.operatorVerbose}\t${this.OPERAND1()}`);
    }
  
    toTuple(): Quad {
      return ['', `${this.operatorVerbose} ${this.OPERAND1()}`, null, null];
    }
  }