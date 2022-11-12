
import { CompositionComponent, TemporalValue } from '../../../Components';
import { Quadruple, Quad } from './Quadruple';

export class MemoryAddress extends CompositionComponent {
  static Name = 'Memory';
  static Type = 'Memory';
  address: string;
  prepender = '';
  constructor(address: TemporalValue | string | number) {
    super();
    this.componentName = MemoryAddress.Name;
    this.componentType = MemoryAddress.Type;
    if (typeof address === 'number' || (typeof address === 'string' && !isNaN(parseInt(address)))) {
      this.address = address.toString(16);
      this.prepender = '0x';
    } else if (typeof address === 'string') {
      this.address = address;
    } else {
      this.address = address.toString();
    }
  }
  clone(): MemoryAddress {
    return new MemoryAddress(this.address);
  }

  toString = () => {
    // if (offset) {
    // return `${this.componentName}[${this.prepender}${this.address} + ${offset.toString(16)}]`;
    // }
    return `${this.prepender}(${this.address})`;
  };

  toMIPS = () => {
    const offset = this.address;
    return this.toString()
  }
}

interface IMemoryManagement<T = any> {
  dataMovesInto: T;
  dataMovesFrom: T;
  offset?: number | string;
  comment?: string;
}
/**
 * Basic memory management class
 */
export class MemoryManagement extends Quadruple {
  operator: string = '<-';
  operatorVerbose: string = 'move';
  offset: number | string;

  constructor(options: IMemoryManagement) {
    const { dataMovesInto: dest, dataMovesFrom: src1, comment } = options;
    super({ dest, src1, comment });
    this.offset = options.offset ?? 0;
  }
  toMIPS(): string {
    throw new Error('Method not implemented.');
  }
  toString(): string {
    throw new Error('Method not implemented.');
  }
  calculateComment(): string {
    throw new Error('Method not implemented.');
  }
}

/**
 * Copy from register to memory
 * @example
 * sw $1, 100($2) // Memory[$2 + 100] = $1
 */
export class StoreWord extends MemoryManagement {
  operator: string = '=';
  operatorVerbose: string = 'sw';

  getOffsetString = () => (this.offset ? `(${this.offset})` : '');
  calculateComment(): string {
    const first = this.OPERAND1();
    const temporal = this.DESTINATION();
    this.comment = `Saving value ${first} to memory address in ${temporal}${this.getOffsetString?.() || 0}`;
    return this.comment;
  }

  toMIPS(): string {
    const offset = this.offset ? `${this.offset}` : '';
    return this.withComment(`\t\t${this.operatorVerbose}\t${this.OPERAND1()}, ${offset}(${this.DESTINATION()})`);
  }
  toString(): string {
    const operand = this.OPERAND1()!;
    const immediate = this.isImmediate(operand!);
    const offset = this.offset ? ` + ${this.offset}` : '';
    if (immediate) {
      return this.withComment(`\t\tMemory[${this.DESTINATION()}${offset}] = ${operand}`);
    }
    return this.withComment(`\t\tMemory[${this.DESTINATION()}${offset}] = ${operand}`);
  }

  toTuple(asString = false): Quad {
    if (asString) {
      return ['=', this.OPERAND1().toString(), null, `Memory[${this.DESTINATION()?.toString()}]`];
    }
    return ['=', this.OPERAND1(), null, this.DESTINATION()];
  }
}

/**
 * Copy from memory to register
 * @example
 * lw $1, 100($2) // $1 = Memory[$2 + 100]
 */
export class LoadWord extends MemoryManagement {
  operator: string = '=';
  operatorVerbose: string = 'lw';
  setOperatorVerbose(): void {
    this.operatorVerbose = this.immediateAppend(this.src1!, this.operatorVerbose);
  }

  calculateComment(): string {
    const first = this.OPERAND1();

    const temporal = this.DESTINATION();
    const immediate = this.immediateAppend(first!, '', true);
    this.comment = `Loading ${immediate}value ${first} into ${temporal}`;
    return this.comment;
  }

  toMIPS(): string {
    const immediate = this.immediateAppend(this.src1!, '') ? 'li' : 'lw';
    const offset = this.offset ? `${this.offset}` : '';
    const operand = immediate ? this.OPERAND1() : `(${this.OPERAND1()})`;
    return this.withComment(`\t\t${immediate}\t${this.DESTINATION()}, ${offset}${operand}`);
  }

  toString(): string {
    const offset = this.offset ? ` + ${this.offset}` : '';
    const operand = this.OPERAND1();
    const immediate = this.immediateAppend(operand!, '');
    if (immediate) {
      return this.withComment(`\t\t${this.DESTINATION()} = ${operand.toString(16)}${offset}`);
    }
    return this.withComment(`\t\t${this.DESTINATION()} = Memory[${this.OPERAND1().toString(16)}${offset}]`);
  }

  toTuple(asString = false): Quad {
    if (asString) {
      return ['=', this.DESTINATION().toString(), null, this.OPERAND1().toString()];
    }
    return ['=', this.DESTINATION(), null, this.OPERAND1()];
  }
}

/**
 * Moves data from one register to another
 * @example
 * move $1, $2 // $1 = $2
 *
 * @warning
 * This is a pseudo instruction given by assembly, it is not a real instruction
 */
export class Move extends MemoryManagement {
  operator: string = '=';
  operatorVerbose: string = 'move';
  calculateComment(): string {
    const first = this.OPERAND1();
    const temporal = this.DESTINATION();
    this.comment = `Moving value from ${first} into ${temporal}`;
    return this.comment;
  }

  toMIPS(): string {
    return this.withComment(`\t\t${this.operatorVerbose}\t${this.DESTINATION()}, ${this.OPERAND1()}`);
  }

  toString(): string {
    const offset = this.offset ? ` + ${this.offset}` : '';
    const operand = this.OPERAND1();
    const immediate = this.immediateAppend(operand!, '');
    if (immediate) {
      return this.withComment(`\t\t${this.DESTINATION()} = ${this.OPERAND1()}${offset}`);
    }
    return this.withComment(`\t\t${this.DESTINATION()} = ${this.OPERAND1()}${offset}`);
  }

  toTuple(asString = false): Quad {
    if (asString) {
      return ['=', this.OPERAND1().toString(), null, this.DESTINATION().toString()];
    }
    return ['=', this.OPERAND1(), null, this.DESTINATION()];
  }
}
