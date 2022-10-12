import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {
  AddContext,
  ClassDefineContext,
  DivisionContext,
  FalseContext,
  FormalContext,
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
import { extractBasicInformation } from '../Components/BasicInformation';
import CompositionComponent from '../Components/Composition';
import { extractContext } from '../Components/ContextHolder';
import TableComponent, { extractTableComponent } from '../Components/Table';
import TypeComponent, { extractTypeComponent } from '../Components/Type';
import BoolType from '../Generics/Boolean.type';
import IntType from '../Generics/Integer.type';
import { ClassType } from '../Generics/Object.type';
import { TableElementType } from './TableElements/index';
import SymbolElement from './TableElements/SymbolElement';

export enum MemoryVariables {
  RETURN = '$v0',
  SYSCALL = 'syscall',
  FUNCTION_PARAMETER_1 = '$a0',
  FUNCTION_PARAMETER_2 = '$a1',
  OBJECT_POINTER = '$a2',
  STACK_POINTER = '$sp',
  JUMP_LINK_REGISTER = '$ra',
  JUMP_WITH_LINK = 'jal',
  JUMP_BACK = 'jr',
}


export class TemporalValue extends CompositionComponent {
  static Name = 'TemporalValue';
  static Type = 'TemporalValue';
  constructor() {
    super();
    this.componentName = TemporalValue.Name;
    this.componentType = TemporalValue.Type;
  }
  clone = () => new TemporalValue();
  toString = () => `T{${this.id.substring(0, 3)}}`;
}

type Quad = [any, any, any, any];
export class Quadruplet extends CompositionComponent {
  elements: Quad = [null, null, null, null];
  stringComponent?: string;
  size: number = 0;

  getTemporal() {
    return this.elements[3];
  }
  clone = () => {
    const quadruplet = new Quadruplet();
    quadruplet.elements = [...this.elements];
    return quadruplet;
  };

  set(newQuadruplet: Quad | string) {
    if (typeof newQuadruplet === 'string') {
      this.stringComponent = newQuadruplet;
    } else {
      this.elements = newQuadruplet;
    }
  }
  get = () => this.stringComponent ?? this.elements;
  toString = () => {
    if (this.stringComponent) {
      return this.stringComponent;
    }
    const [op, first, second, temporal] = this.elements;
    let returnString = `${temporal} = ${first}`;
    // const basicInfo = extractBasicInformation(temporal);

    let comment = '';
    if (second !== null) {
      returnString += ` ${op} ${second}`;
    } else if (temporal?.componentType !== TemporalValue.Type && temporal !== MemoryVariables.RETURN && temporal !== MemoryVariables.FUNCTION_PARAMETER_1) {
      comment = Comment(` ${temporal?.getName?.() ?? temporal} = ${first?.getName?.() ?? first}`);
    }


    return returnString + comment;
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

// let scope = 1;
export function Comment(p_message: string, withDecorator = true) {
  let message = p_message.trim();
  while (message.charAt(0) === '#') {
    message = message.substring(1);
  }
  if (withDecorator) {
    message = '\t\t# ' + message;
  }
  return message;
}

export function BeginComment(p_message: string) {
  const comment = Comment(p_message, false);
  // const repeating = '-'.repeat(50  - 15 * scope);
  // scope += 1;
  return `# BEGIN ${comment}`;
}



export function EndComment(p_message: string) {
  const comment = Comment(p_message, false);
  // scope -= 1;
  // const repeating = '-'.repeat(50  - 15 * scope);
  return `# END ${comment}`;
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
  quadruples: (Quadruplet | string)[] = [];
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

  writeReturn(value: string) {
    const quadrupletForReturn = new Quadruplet();
    quadrupletForReturn.set([null, value, null, MemoryVariables.RETURN]);
    this.addQuadruple(quadrupletForReturn);
    this.addQuadruple(`${MemoryVariables.JUMP_BACK} ${MemoryVariables.JUMP_LINK_REGISTER}`);
  }

  saveToStack(size: number) {
    const quadrupletForSave = new Quadruplet();
    quadrupletForSave.set(['-', MemoryVariables.STACK_POINTER, size, MemoryVariables.STACK_POINTER]);
    this.stackMemoryOffset -= size;
    this.addQuadruple(quadrupletForSave);
  }

  removeFromStack(size: number) {
    const quadrupletForRemove = new Quadruplet();
    quadrupletForRemove.set(['+', MemoryVariables.STACK_POINTER, size, MemoryVariables.STACK_POINTER]);
    this.stackMemoryOffset += size;
    this.addQuadruple(quadrupletForRemove + `\t\t# Remove ${size} from the stack`);
  }

  aggregateResult(aggregate: any, nextResult: any) {
    if (Array.isArray(nextResult)) {
      return [...(aggregate ?? []), ...(nextResult ?? [])];
    }
    return [...aggregate, nextResult];
  }


  AskForHeapMemory(size: number): void {
    /*
    li		$v0, 9					# v0 == 9 				-> Allocate
    li		$a0, 20					# 20 bytes
    syscall
    */
    const allocate = new Quadruplet();
    allocate.set(['li', 9, null, '$v0']);
    const allocateValue = new Quadruplet();
    allocateValue.set(['li', size, null, '$a0']);
    const allocateSyscall = new Quadruplet();
    allocateSyscall.set('syscall');
    this.addQuadruple(allocate + '\t\t# v0 == 9 -> Allocate');
    this.addQuadruple(allocateValue + `\t\t# ${size} bytes`);
    this.addQuadruple(allocateSyscall);
  }
  /** This is the entry point of the visitor. It uses the "Main" branch if no parameter is passed. Semantic checks must've all passed already. */


  instantiate(ctx: ClassDefineContext = this.mainMethodBranch) {
    this.addQuadruple('.data\nprogram_start:\t\t.word\t\t0\n\n.text\nmain:', false);
    this.visit(ctx);
    this.addQuadruple('end:\n\tli $v0, 10\t\t# Exit the program\n\tsyscall');
    console.log(this.quadruples.map((quad) => quad.toString()).join('\n'));
  }

  visitId = (ctx: IdContext) => {
    const name = ctx.IDENTIFIER();
    const currentTable = this.currentClassTable();
    const found = currentTable.get(name.text)! as SymbolElement;
    const inTable = currentTable.getAll();
    const allElements = currentTable.getAll(false).filter(element => element.componentName === SymbolElement.Name && !inTable.includes(element));
    let temporal;
    const foundTemporal = inTable.find((el) => (el as SymbolElement).getName() === name.text) as SymbolElement;
    if (foundTemporal) {
      // If it is in the table, use it's temporal
      temporal = `T{${foundTemporal.id.substring(0, 3)}}\t\t# Use the temporal of the variable ${name.text} as passed through the stack`;
    } else {
      const elementNames = allElements.map((el: any) => (el as SymbolElement).getName());
      const elementSizes = allElements.map((el: any) => el.getSize());
      const currentElementIndex = elementNames.indexOf(found.getName());
      // Find the offset
      const offset = elementSizes.slice(0, currentElementIndex).reduce((a, b) => a + b, 0);
      temporal = `${MemoryVariables.OBJECT_POINTER}(${offset})\t\t# Use the object pointer to access variable '${found.getName()}'`;
    }

    const newQuadruplet = new Quadruplet();
    newQuadruplet.set(['=', temporal, null, new TemporalValue()]);
    this.addQuadruple(newQuadruplet);
    return newQuadruplet;
  };

  scopes: string[] = ['main'];
  addQuadruple = (quadruple: Quadruplet | string, addTab: Boolean = true) => {
    const name = this.scopes.at(-1)!;
    if (!this.methods[name]) {
      this.methods[name] = [];
    }
    this.methods[name].push((addTab ? '\t' : '') + quadruple);
  };

  pushScope = (scope: string) => {
    this.scopes.push(scope);
  };
  popScope = () => {
    this.scopes.pop();
  };

  methods: { [key: string]: (Quadruplet | string)[]; } = {};

  visitMethodCall = (ctx: MethodCallContext): any => {
    const name = ctx.IDENTIFIER();
    const [callingVariable] = ctx.expression();
    const currentClassTable = this.currentClassTable();
    const callingVariableSymbol = currentClassTable.get(callingVariable.text);
    const variableType = extractTypeComponent(callingVariableSymbol)! as ClassType;
    const variableTable = extractTableComponent(callingVariableSymbol);

    // @ts-ignore
    const expectedMethodName = `class_${variableType.getName()}_method_${name.text}`;
    this.addQuadruple(`${MemoryVariables.JUMP_WITH_LINK} ${expectedMethodName}\t\t# Jump to the method ${name.text} of class ${variableType.getName() }`);
    const method = this.methods[expectedMethodName];
    if (!method) {
      this.pushScope(expectedMethodName);
      this.addQuadruple('\n\n' + expectedMethodName + ':', false);
      this.addQuadruple(MemoryVariables.OBJECT_POINTER + ' = $sp(0)\t\t# Pointer to the object calling the function. It\'s only size 1');
      const stackBefore = this.stackMemoryOffset;
      this.stackMemoryOffset -= 1; // The pointer is 4 bytes
      const method = variableTable!.get(name.text)!;
      const methodContext = extractContext(method)!;
      this.classStack.push(method as ClassType);
      const newMethod = this.visitChildren(methodContext.context!);
      newMethod.forEach(this.addQuadruple);
      // this.methods[expectedMethodName] = newMethod;
      this.classStack.pop();
      this.removeFromStack(stackBefore - this.stackMemoryOffset);
      this.stackMemoryOffset = stackBefore;
      this.writeReturn(newMethod.at(-1).getTemporal());
    }
    this.popScope();

    // TODO: Remove the parameters from the stack
    return this.visitChildren(ctx);
  };

  stackMemoryOffset = 0;

  visitFormal = (ctx: FormalContext) => {
    const name = ctx.IDENTIFIER();
    const currentClassTable = this.currentClassTable()!;
    const newTemporal = new TemporalValue();
    const quadruple = new Quadruplet();
    const symbol = currentClassTable.get(name.text) as SymbolElement;
    quadruple.set([null, MemoryVariables.STACK_POINTER + '(' + (this.stackMemoryOffset) + ')', null, newTemporal]);
    symbol.id = newTemporal.id;
    this.addQuadruple(quadruple + Comment('# Parameter passed through stack'));
    this.stackMemoryOffset -= symbol!.getSize();
    return quadruple;
  };

  visitProperty = (ctx: PropertyContext): any => {
    const name = ctx.IDENTIFIER();
    const currentClassTable = this.currentClassTable();
    const referencedVariable = currentClassTable.get(name)! as SymbolElement;
    this.addQuadruple(BeginComment(`PROPERTY ${name.text}`));
    const [result] = this.visitChildren(ctx);
    const quadruple = new Quadruplet();
    quadruple.set(['=', result.getTemporal(), null, referencedVariable]);

    this.AskForHeapMemory(result.size);
    this.addQuadruple(quadruple);
    if (!result.size) {
      throw new Error('Property must have a size');
    }
    referencedVariable.setMemoryAddress(this.memoryOffset);
    this.register(referencedVariable.id, result.size);
    this.addQuadruple(EndComment(`PROPERTY ${name.text}`));
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
    quadruple.set(['=', MemoryVariables.RETURN, null, temporal]);
    this.addQuadruple(quadruple);
    return quadruple;
  };

  visitMethod = (ctx: MethodContext) => {
    const name = ctx.IDENTIFIER();
    const type = ctx.TYPE();
    return this.visitChildren(ctx);
  };
}
