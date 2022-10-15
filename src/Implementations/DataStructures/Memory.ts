import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';

import {
  AddContext,
  AssignmentContext,
  AssignmentExprContext,
  BlockContext,
  ClassDefineContext,
  DivisionContext,
  EqualContext,
  FalseContext,
  FormalContext,
  IdContext,
  IfContext,
  IntContext,
  LessEqualContext,
  LessThanContext,
  LetInContext,
  MethodCallContext,
  MethodContext,
  MinusContext,
  MultiplyContext,
  NegativeContext,
  NewContext,
  OwnMethodCallContext,
  PropertyContext,
  TrueContext,
  WhileContext,
} from '../../antlr/yaplParser';
import { yaplVisitor } from '../../antlr/yaplVisitor';
import CompositionComponent from '../Components/Composition';
import TableComponent, { extractTableComponent } from '../Components/Table';
import TypeComponent from '../Components/Type';
import { ClassType } from '../Generics/Object.type';
import {
  visitAssignment,
  visitAssignmentExpr,
  visitBlock,
  visitClassDefine,
  visitDivision,
  visitEqual,
  visitFalse,
  visitFormal,
  visitId,
  visitIf,
  visitInt,
  visitLessEqual,
  visitLessThan,
  visitLetIn,
  visitMethod,
  visitMethodCall,
  visitMinus,
  visitMultiply,
  visitNegative,
  visitNew,
  visitOwnMethodCall,
  visitProperty,
  visitTrue,
  visitWhile,
} from './MemoryVisitors';
import add from './MemoryVisitors/add';
import { LinkedJump, UnconditionalJump } from './MemoryVisitors/Instructions/Jumps';
import { LoadWord, MemoryAddress, Move, StoreWord } from './MemoryVisitors/Instructions/MemoryManagement';
import { MethodDeclaration, Return, SysCall, TextHolder } from './MemoryVisitors/Instructions/Misc';
import { Add, Sub } from './MemoryVisitors/Instructions/Operation';
import Quadruple, { Quad } from './MemoryVisitors/Instructions/Quadruple';
import {
  ALLOCATE,
  EXIT,
  FUNCTION_PARAMETER_1,
  JUMP_LINK_REGISTER,
  STACK_POINTER,
  TemporalValue,
  V0,
} from './MemoryVisitors/TemporaryValues';
import { SymbolElement, TableElementType } from './TableElements';

export interface IMemoryVisitor {
  size: number;
  getTemporal: () => TemporalValue;
  save?: boolean;
}

export class MemoryVisitor extends AbstractParseTreeVisitor<IMemoryVisitor[]> implements yaplVisitor<IMemoryVisitor[]> {
  static Name = 'MemoryComponent';
  static Type = 'MemoryComponent';
  symbolsTable: TableComponent<TypeComponent>;
  mainMethodBranch: ClassDefineContext;
  mainClassSymbolsTable: TableComponent<TableElementType>;
  memorySymbolsTable: TableComponent<TableElementType>;
  memoryOffset: number = 0;
  memoryStack: any[] = [];
  classStack: (ClassType | SymbolElement)[] = [];
  // TODO: Add a table scope
  /** Holds the memory elements */
  constructor(symbolsTable: TableComponent<TypeComponent>, mainMethodBranch: ClassDefineContext) {
    super();
    this.symbolsTable = symbolsTable;
    this.mainClassSymbolsTable = extractTableComponent<TableElementType>(this.symbolsTable.get('Main'))!;
    this.mainMethodBranch = mainMethodBranch;
    this.memorySymbolsTable = new TableComponent<TableElementType>();
    this.classStack.push(this.symbolsTable.get('Main')! as ClassType);
  }
  currentClass = (offset: number = 0) => this.classStack.at(offset - 1)!;
  currentClassTable = <T extends CompositionComponent>(offset: number = 0) =>
    extractTableComponent<T>(this.currentClass(offset))!;

  findInStack(value: string): any | null {
    const stack = [...this.classStack].reverse();
    for (const element of stack) {
      const table = extractTableComponent<TableElementType>(element);
      if (table) {
        const symbol = table.get(value);
        if (symbol) {
          return symbol;
        }
      }
    }
    return null;
  }

  register = (id: string, size: number) => {
    const toPush = [id, this.memoryOffset, size];
    this.memoryStack.push(toPush);
    this.memoryOffset += size;
    return toPush;
  };

  protected defaultResult(): IMemoryVisitor[] {
    return [];
  }

  writeReturn(value: TemporalValue) {
    this.addQuadruple(new Move({ dataMovesFrom: value, dataMovesInto: new V0() }));
    this.addQuadruple(new Return());
  }

  saveToStack(size: number) {
    if (size <= 0) return;
    this.addQuadruple(
      new Sub({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: size,
        comment: 'Add to stack',
      }),
    );
    this.stackMemoryOffset -= size;
  }

  removeFromStack(size: number) {
    if (size <= 0) return;
    this.stackMemoryOffset += size;
    this.addQuadruple(
      new Add({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: size.toString(16),
        comment: 'Remove from stack',
      }),
    );
  }

  aggregateResult(aggregate: IMemoryVisitor[], nextResult: IMemoryVisitor[]): IMemoryVisitor[] {
    if (Array.isArray(nextResult)) {
      return [...(aggregate ?? []), ...(nextResult ?? [])];
    }
    return [...aggregate, nextResult];
  }

  startCall() {
    [
      new Sub({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: 4,
        comment: 'Add to stack to save values',
      }),
      new StoreWord({
        dataMovesFrom: new JUMP_LINK_REGISTER(),
        dataMovesInto: new STACK_POINTER(),
        offset: -4,
        comment: 'Save the return address',
      }),
    ].forEach((instruction) => this.addQuadruple(instruction));
  }

  endCall() {
    [
      new LoadWord({
        dataMovesInto: new JUMP_LINK_REGISTER(),
        dataMovesFrom: new STACK_POINTER(),
        offset: -4,
        comment: 'Load the return address back from the stack',
      }),
      new Add({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: '4',
        comment: 'Restore the stack pointer',
      }),
    ].forEach((instruction) => this.addQuadruple(instruction));
  }

  AskForHeapMemory(size: number): void {
    [
      new Move({
        dataMovesInto: new V0(),
        dataMovesFrom: new ALLOCATE(),
        comment: `The value of ${new ALLOCATE()} calls for memory allocation in the heap`,
      }),
      new Move({
        dataMovesInto: new FUNCTION_PARAMETER_1(),
        dataMovesFrom: size.toString(10),
        comment: `Ask for ${size} bytes of memory`,
      }),
      new SysCall(),
    ].forEach((instruction) => this.addQuadruple(instruction));
  }

  AskForStackMemory(size: number): void {
    if (size <= 0) return;
    [
      new Sub({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: size,
        comment: `Ask for ${size} bytes of memory from the stack`,
      }),
    ].forEach((instruction) => this.addQuadruple(instruction));
    this.stackMemoryOffset -= size;
  }

  LiberateStackMemory(size: number): void {
    if (size <= 0) return;
    [
      new Add({
        saveIn: new STACK_POINTER(),
        operand1: new STACK_POINTER(),
        operand2: size,
        comment: `Liberate ${size} bytes of memory from the stack`,
      }),
    ].forEach((instruction) => this.addQuadruple(instruction));
    this.stackMemoryOffset += size;
  }

  end = () => {
    const end = 'end';

    [
      new UnconditionalJump(end),
      new MethodDeclaration(end),
      new LoadWord({
        dataMovesInto: new V0(),
        dataMovesFrom: new EXIT(),
        comment: 'Exit the program',
      }),
      new SysCall(),
    ].forEach((quadruple) => this.addQuadruple(quadruple));
  };

  getQuadruples(): string {
    let output = '';
    for (const key of Object.keys(this.methods)) {
      output +=
        this.methods[key]
          .map((t) => t.toString())
          .join('\n')
          .toString() + '\n';
    }
    return output;
  }

  getTuples(asString: boolean = false): Quad[] {
    let output = [];
    for (const key of Object.keys(this.methods)) {
      output.push(...this.methods[key].map((t) => t.toTuple(asString)));
    }
    return output;
  }

  instantiate(ctx: ClassDefineContext = this.mainMethodBranch) {
    this.addQuadruple(
      new TextHolder('.data'),
      new TextHolder('.program_start:\t\t.word\t\t0'),
      new TextHolder('.text'),
      new TextHolder('main:\t\t#\tEntry point of the program'),
    );
    const result = this.visit(ctx).at(-1)!;
    // const returnValue = result?.getTemporal();
    this.scopes = ['main'];
    this.startCall();
    this.addQuadruple(new LinkedJump('Main::main()'));
    this.endCall();
    // console.log(this.getQuadruples());
    // console.log('done');
  }

  visitAssignmentExpr = (ctx: AssignmentExprContext) => {
    return visitAssignmentExpr(this, ctx);
  };

  visitBlock = (ctx: BlockContext) => {
    return visitBlock(this, ctx);
  };

  visitDivision = (ctx: DivisionContext) => {
    return visitDivision(this, ctx);
  };

  visitEqual = (ctx: EqualContext) => {
    return visitEqual(this, ctx);
  };

  visitLessEqual = (ctx: LessEqualContext) => {
    return visitLessEqual(this, ctx);
  };

  visitLessThan = (ctx: LessThanContext) => {
    return visitLessThan(this, ctx);
  };

  visitFalse = (ctx: FalseContext) => {
    return visitFalse(this, ctx);
  };

  visitId = (ctx: IdContext): IMemoryVisitor[] => {
    return visitId(this, ctx);
  };

  visitIf = (ctx: IfContext): IMemoryVisitor[] => {
    return visitIf(this, ctx);
  };

  scopes: string[] = ['main'];
  addQuadruple = (...quadruple: Quadruple[]) => {
    const name = this.scopes.at(-1)!;
    if (!this.methods[name]) {
      this.methods[name] = [];
    }
    this.methods[name].push(...quadruple);
  };

  pushScope = (scope: string) => {
    this.scopes.push(scope);
  };
  popScope = () => {
    this.scopes.pop();
  };

  methods: { [key: string]: Quadruple[] } = {};

  stackMemoryOffset = 0;

  visitFormal = (ctx: FormalContext): IMemoryVisitor[] => {
    return visitFormal(this, ctx);
  };

  visitProperty = (ctx: PropertyContext): IMemoryVisitor[] => {
    return visitProperty(this, ctx);
  };

  visitAdd = (ctx: AddContext): IMemoryVisitor[] => {
    return add(this, ctx);
  };

  visitAssignment = (ctx: AssignmentContext): IMemoryVisitor[] => {
    return visitAssignment(this, ctx);
  };

  visitMethodCall = (ctx: MethodCallContext): IMemoryVisitor[] => {
    return visitMethodCall(this, ctx);
  };

  visitMinus = (ctx: MinusContext): IMemoryVisitor[] => {
    return visitMinus(this, ctx);
  };

  visitNegative = (ctx: NegativeContext): IMemoryVisitor[] => {
    return visitNegative(this, ctx);
  };

  visitOwnMethodCall = (ctx: OwnMethodCallContext): IMemoryVisitor[] => {
    return visitOwnMethodCall(this, ctx);
  };

  visitWhile = (ctx: WhileContext): IMemoryVisitor[] => {
    return visitWhile(this, ctx);
  };

  visitMultiply = (ctx: MultiplyContext): IMemoryVisitor[] => {
    return visitMultiply(this, ctx);
  };

  visitInt = (ctx: IntContext): IMemoryVisitor[] => {
    return visitInt(this, ctx);
  };

  visitLetIn = (ctx: LetInContext): IMemoryVisitor[] => {
    return visitLetIn(this, ctx);
  };

  visitTrue = (ctx: TrueContext): IMemoryVisitor[] => {
    return visitTrue(this, ctx);
  };

  visitNew = (ctx: NewContext): IMemoryVisitor[] => {
    return visitNew(this, ctx);
  };

  visitMethod = (ctx: MethodContext): IMemoryVisitor[] => {
    return visitMethod(this, ctx);
  };
}
