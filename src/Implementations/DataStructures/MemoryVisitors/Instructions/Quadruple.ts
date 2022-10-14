interface IQuadruple {
    dest?: any;
    src1?: any;
    src2?: any;
    comment?: string;
}


export type Quad = [any, any, any, any];
export default abstract class Quadruple<T = any> {
    abstract operator: string;
    abstract operatorVerbose: string;
    src1: T | null = null;
    src2: T | null = null;
    dest: T | null = null;
    comment: string;
    constructor(options?: IQuadruple) {

        this.src1 = options?.src1 ?? null;
        this.src2 = options?.src2 ?? null;
        this.dest = options?.dest ?? null;
        this.setOperatorVerbose();
        if (options?.comment) this.comment = options.comment;
        else this.comment = this.calculateComment();
    }

    setOperatorVerbose(): void { };
    isRegistry(reg: string) {
        return reg.toString().startsWith('$') || reg.toString().toLocaleLowerCase().startsWith('t');
    }


    immediateAppend(value: string, appendTo: string, extended: boolean = false) {
        if (this.isRegistry(value)) {
            return appendTo;
        } else if (extended) {
            return 'immediate ' + appendTo;
        } return appendTo + 'i';
    }

    isImmediate = (value: string) => !this.isRegistry(value);
    OPERAND(verbose: boolean = false): string {
        return verbose ? this.operatorVerbose! : this.operator!;
    }
    OPERAND1 = () => this.src1;
    OPERAND2 = () => this.src2;
    DESTINATION = () => this.dest;
    abstract toMIPS(): string;

    abstract toString(): string;
    getTemporal = (): T => this.DESTINATION()!;
    withComment = (val: string) => {
        return `${val}\t\t#\t${this.comment || this.calculateComment?.()}`;
    };
    toTuple(): Quad {
        return [this.OPERAND(), this.OPERAND1(), this.OPERAND2(), this.DESTINATION()];
    }
    abstract calculateComment(): string;
};