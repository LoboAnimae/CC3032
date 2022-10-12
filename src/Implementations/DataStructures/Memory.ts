import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {
  AddContext,
  ClassDefineContext,
  DivisionContext,
  FalseContext,
  IdContext,
  IntContext,
  MethodCallContext,
  MethodContext,
  MinusContext,
  MultiplyContext,
  NewContext,
  PropertyContext,
  TrueContext,
} from '../../antlr/yaplParser';
import { yaplVisitor } from '../../antlr/yaplVisitor';
import CompositionComponent from '../Components/Composition';
import TableComponent, { extractTableComponent } from '../Components/Table';
import TypeComponent, { extractTypeComponent } from '../Components/Type';
import BoolType from '../Generics/Boolean.type';
import IntType from '../Generics/Integer.type';
import { ClassType } from '../Generics/Object.type';
import { TableElementType } from './TableElements/index';
import SymbolElement from './TableElements/SymbolElement';

export class TemporalValue extends CompositionComponent {
  static Name = 'TemporalValue';
  static Type = 'TemporalValue';
  constructor() {
    super();
    this.componentName = TemporalValue.Name;
    this.componentType = TemporalValue.Type;
  }
  clone = () => new TemporalValue();
  toString = () => `${this.componentName}{ ${this.id.substring(0, 4)} }`;
}

type Quad = [any, any, any, any];
export class Quadruplet extends CompositionComponent {
  elements: Quad = [null, null, null, null];
  size: number = 0;

  getTemporal() {
    return this.elements[3];
  }
  clone = () => {
    const quadruplet = new Quadruplet();
    quadruplet.elements = [...this.elements];
    return quadruplet;
  };

  set(newQuadruplet: Quad) {
    this.elements = newQuadruplet;
  }
  get = () => this.elements;
  toString = () => {
    const [op, first, second, temporal] = this.elements;
    let returnString = `${temporal} = ${first}`;
    if (second !== null) {
      returnString += ` ${op} ${second}`;
    }
    return returnString;
  };
}

export class MemoryElement extends CompositionComponent {
  referentialId: string;
  memoryOffset: number;
  static Name = 'MemoryElement';

  constructor(id: string, memoryOffset: number) {
    super();
    this.referentialId = id;
    this.memoryOffset = memoryOffset;
    this.componentName = MemoryElement.Name;
  }

  toString(): string {
    return `MemoryElement{ id{ ${this.id} }, memoryOffset{ ${this.memoryOffset} } }`;
  }

  toCode(): string {
    return this.id;
  }

  clone(): CompositionComponent {
    return new MemoryElement(this.id, this.memoryOffset);
  }
}

export class MemoryVisitor extends AbstractParseTreeVisitor<any> implements yaplVisitor<any> {
  static Name = 'MemoryComponent';
  static Type = 'MemoryComponent';
  symbolsTable: TableComponent<TypeComponent>;
  mainMethodBranch: ClassDefineContext;
  mainClassSymbolsTable: TableComponent<TableElementType>;
  memorySymbolsTable: TableComponent<TableElementType>;
  memoryOffset: number = 0;
  memoryStack: any[] = [];
  quadruples: Quadruplet[] = [];
  classStack: ClassType[] = [];
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
  currentClass = () => this.classStack.at(-1)!;
  currentClassTable = () => extractTableComponent(this.currentClass())!;

  register = (id: string, size: number) => {
    const toPush = [id, this.memoryOffset, size];
    this.memoryStack.push(toPush);
    this.memoryOffset += size;
    return toPush;
  };

  protected defaultResult() {
    return [];
  }

  /** This is the entry point of the visitor. It uses the "Main" branch if no parameter is passed. Semantic checks must've all passed already. */
  instantiate(ctx: ClassDefineContext = this.mainMethodBranch) {
    return this.visit(ctx);
  }

  visitId = (ctx: IdContext) => {
    return this.visitChildren(ctx);
  };

  addQuadruple = (quadruple: Quadruplet) => {
    this.quadruples.push(quadruple);
  };

  visitMethodCall = (ctx: MethodCallContext): any => {
    const name = ctx.IDENTIFIER();
    const type = ctx.TYPE();
    const [callingVariable, ...parameters] = ctx.expression();
    return this.visitChildren(ctx);
  };

  visitProperty = (ctx: PropertyContext): any => {
    const name = ctx.IDENTIFIER();
    const currentClassTable = this.currentClassTable();
    const referencedVariable = currentClassTable.get(name)! as SymbolElement;
    const result = this.visitChildren(ctx);
    const quadruple = new Quadruplet();
    quadruple.set(['=', result.getTemporal(), null, referencedVariable]);
    this.addQuadruple(quadruple);
    if (!result.size) {
      throw new Error('Property must have a size');
    }
    referencedVariable.setMemoryAddress(this.memoryOffset);
    this.register(referencedVariable.id, result.size);
    return quadruple;
  };

  basicOperation = (ctx: AddContext | MinusContext | MultiplyContext | DivisionContext) => {
    const [leftChild, rightChild] = ctx.expression();
    const leftChildResult = this.visit(leftChild);
    const rightChildResult = this.visit(rightChild);
    const leftChildTemporal = leftChildResult.getTemporal();
    const rightChildTemporal = rightChildResult.getTemporal();
    const temporal = new TemporalValue();
    return [leftChildTemporal, rightChildTemporal, temporal];
  };

  visitAdd = (ctx: AddContext): any => {
    const addQuadruple = new Quadruplet();
    const [leftChildTemporal, rightChildTemporal, temporal] = this.basicOperation(ctx);
    addQuadruple.set(['+', leftChildTemporal, rightChildTemporal, temporal]);
    this.addQuadruple(addQuadruple);
    addQuadruple.size = IntType.Size;
    return addQuadruple;
  };

  visitMinus = (ctx: MinusContext): any => {
    const minusQuadruple = new Quadruplet();
    const [leftChildTemporal, rightChildTemporal, temporal] = this.basicOperation(ctx);
    minusQuadruple.set(['-', leftChildTemporal, rightChildTemporal, temporal]);
    this.addQuadruple(minusQuadruple);
    minusQuadruple.size = IntType.Size;
    return minusQuadruple;
  };

  visitMultiply = (ctx: MultiplyContext) => {
    const multQuadruple = new Quadruplet();
    const [leftChildTemporal, rightChildTemporal, temporal] = this.basicOperation(ctx);
    multQuadruple.set(['*', leftChildTemporal, rightChildTemporal, temporal]);
    this.addQuadruple(multQuadruple);
    multQuadruple.size = IntType.Size;
    return multQuadruple;
  };

  visitInt = (ctx: IntContext) => {
    const temporal = new TemporalValue();
    const quadruplet = new Quadruplet();
    quadruplet.set(['=', ctx.text, null, temporal]);
    this.addQuadruple(quadruplet);
    quadruplet.size = IntType.Size;
    return quadruplet;
  };

  visitTrue = (ctx: TrueContext) => {
    const temporal = new TemporalValue();
    const quadruplet = new Quadruplet();
    quadruplet.set(['=', 1, null, temporal]);
    this.addQuadruple(quadruplet);
    quadruplet.size = BoolType.Size;
    return quadruplet;
  };

  visitFalse = (ctx: FalseContext) => {
    const temporal = new TemporalValue();
    const quadruplet = new Quadruplet();
    quadruplet.set(['=', 0, null, temporal]);
    this.addQuadruple(quadruplet);
    quadruplet.size = BoolType.Size;
    return quadruplet;
  };

  visitNew = (ctx: NewContext) => {
    const quadruple = new Quadruplet();
    const type = ctx.TYPE();
    const temporal = new TemporalValue();
    const referencedType = this.symbolsTable.get(type.text)! as ClassType;
    const size = referencedType.getSize();
    quadruple.size = size;
    quadruple.set(['=', `[*(0x${this.memoryOffset.toString(16)})]<new ${type.text}>`, null, temporal]);
    this.addQuadruple(quadruple);
    return quadruple;
  };

  visitMethod = (ctx: MethodContext) => {
    const name = ctx.IDENTIFIER();
    const type = ctx.TYPE();
    return this.visitChildren(ctx);
  };
}
