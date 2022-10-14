import Quadruple from "./Quadruple";

interface IOperation {
    saveIn: any;
    operand1: any;
    operand2: any;
    comment?: string;
}


export class Operation extends Quadruple {
    comment: string = '';
    operator: string = '+';
    operatorVerbose: string = 'Add';
    constructor(options: IOperation) {
        const { saveIn: dest, operand1: src1, operand2: src2, comment } = options;
        super({ dest, src1, src2, comment });
    }

    toMIPS(): string {
        const operation = this.OPERAND(true);
        const dest = this.DESTINATION()!;
        const src1 = this.OPERAND1()!;
        const src2 = this.OPERAND2()!;
        return this.withComment(`\t\t${operation} ${dest}, ${src1}, ${src2}`);
    }
    toString(): string {
        return this.withComment(`\t\t${this.DESTINATION()} = ${this.OPERAND1()} ${this.OPERAND()} ${this.OPERAND2()}`);
    }


    setOperatorVerbose(): void {
        this.operatorVerbose = this.immediateAppend(this.src2!, this.operatorVerbose);
    }
    calculateComment() {
        return '';
    }

}

/**
 * Adds two values and stores the result in a temporal variable
 * @example
 * add $1, $2, $3 // $1 = $2 + $3
 */
export class Add extends Operation {
    comment: string = '';
    operator: string = '+';
    operatorVerbose: string = 'Add';
    calculateComment() {
        const first = this.OPERAND1();
        const second = this.OPERAND2();
        const temporal = this.DESTINATION();
        this.comment = `Adding ${this.immediateAppend(second!, '', true)} value ${second} to ${first} and storing it in ${temporal}`;
        return this.comment;
    }
}


/**
* Extension of the Add class, but subtracts the second operand from the first. Some documentation
* says that MIPS uses the add operation for both, making the second operand negative.
* 
* @example
* sub $1, $2, $3 // $1 = $2 - $3
*/
export class Sub extends Add {
    operator: string = '-';
}

/**
 * Multiplies two values and stores the result in a temporal variable
 * @example
 * mul $1, $2, $3 // $1 = $2 * $3
 */
export class Mult extends Operation {
    operator: string = '*';
    operatorVerbose: string = 'mult';
    comment: string = '';
    calculateComment(): string {
        const first = this.OPERAND1();
        const second = this.OPERAND2();
        const temporal = this.DESTINATION();
        this.comment = `Multiplying value ${second} to ${first} and storing it in ${temporal}`;
        return this.comment;
    }

}

/**
 * MIPS does have a division operator that stores the remainder in mfhi and the quotient in mflo.
 */
export class Div extends Operation {
    operator: string = '/';
    operatorVerbose: string = 'div';
    comment: string = '';
    calculateComment(): string {
        const first = this.OPERAND1();
        const second = this.OPERAND2();
        const temporal = this.DESTINATION();
        this.comment = `Dividing value ${second} to ${first} and storing it in ${temporal}`;
        return this.comment;
    }
}