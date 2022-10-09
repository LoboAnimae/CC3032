import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {
  AddContext,
  ClassDefineContext,
  IdContext,
  IntContext,
  MethodCallContext,
  MethodContext,
  NewContext,
  PropertyContext,
} from '../../antlr/yaplParser';
import { yaplVisitor } from '../../antlr/yaplVisitor';
import CompositionComponent from '../Components/Composition';
import TableComponent, { extractTableComponent } from '../Components/Table';
import TypeComponent, { extractTypeComponent } from '../Components/Type';
import IntType from '../Generics/Integer.type';
import { ClassType } from '../Generics/Object.type';
import { Primitive } from '../Generics/Primitive.type';
import { TableElementType } from './TableElements/index';
import SymbolElement from './TableElements/SymbolElement';
import TableElement from './TableElements/TableElement';

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
  quadruples: string[] = ['.text', 'main:'];
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

  register = (id: string, withValue: string, size: number) => {
    const toPush = [id, withValue, this.memoryOffset, size];
    this.memoryStack.push(toPush);
    this.memoryOffset += size;
    return toPush;
  };

  protected defaultResult() {
    return [];
  }

  visitId = (ctx: IdContext) => {
    return this.visitChildren(ctx);
  };

  addQuadruple = (quadruple: string) => {
    this.quadruples.push('\t' + quadruple);
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
    const currentClass = this.currentClass();
    const referencedVariable = currentClassTable.get(name)!;
    const type = ctx.TYPE();
    const size = this.visitChildren(ctx);
    const expression = ctx.expression();

    const varType = this.symbolsTable.get(type)!;
    const value = expression?.text ?? varType.defaultValue;

    const resulting = this.register(referencedVariable.id, '' + value, varType.sizeInBytes ?? 0);

    let quadruple = `<*[${resulting[2]}]{${currentClass.getName()}.${name}}> = ${value}; \t\t\t# Assignation`;
    this.addQuadruple(quadruple);
    return this.visitChildren(ctx);
  };

  visitAdd = (ctx: AddContext): any => {
    return this.visitChildren(ctx);
  };

  visitInt = (ctx: IntContext) => {
    const intTable = this.symbolsTable.get(IntType.Name)!.copy() as Primitive;
    return intTable.sizeInBytes;
  };

  visitNew = (ctx: NewContext) => {
    const referencedTable = ctx.TYPE();
    const referencedTableType = this.symbolsTable.get(referencedTable)!;
    const referencedTypeTable = extractTableComponent(referencedTableType)!;
    const allSymbols = referencedTypeTable.getAll(false).filter((t) => t.componentName === SymbolElement.Name);

    for (const symbol of allSymbols) {
      const symbolElement = symbol as SymbolElement;
      const type = extractTypeComponent(symbolElement)!;
      this.register(symbolElement.id, type.defaultValue, type.sizeInBytes ?? 0);
    }
    return this.visitChildren(ctx);
  };
}
