import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {
  AddContext,
  AssignmentContext,
  BlockContext,
  ClassDefineContext,
  DivisionContext,
  EqualContext,
  FalseContext,
  FormalContext,
  IdContext,
  IntContext,
  IsvoidContext,
  LessEqualContext,
  LessThanContext,
  MethodCallContext,
  MethodContext,
  MinusContext,
  MultiplyContext,
  NegativeContext,
  NewContext,
  OwnMethodCallContext,
  ParenthesesContext,
  PropertyContext,
  StringContext,
  TrueContext,
  WhileContext
} from './antlr/yaplParser';
import { yaplVisitor } from './antlr/yaplVisitor';
import {
  CompositionComponent, TableComponent,
  TypeComponent
} from './Implementations/Components/index';
import { Stack } from './Implementations/DataStructures/Stack';
import { MethodElement, SymbolElement } from './Implementations/DataStructures/TableElements/index';
import { BasicStorage, IError } from './Implementations/Errors/Errors';
import Bool from './Implementations/Generics/Boolean.type';
import { default as IntType } from './Implementations/Generics/Integer.type';
import { IOType } from './Implementations/Generics/IO.type';
import { ClassType, ObjectType } from './Implementations/Generics/Object.type';
import { StringType } from './Implementations/Generics/String.type';
import visitAdd from './Implementations/visitorFunctions/add';
import visitAssignment from './Implementations/visitorFunctions/assignment';
import visitBlock from './Implementations/visitorFunctions/block';
import visitClassDefine from './Implementations/visitorFunctions/classDefine';
import visitDivision from './Implementations/visitorFunctions/division';
import visitEqual from './Implementations/visitorFunctions/equal';
import visitFalse from './Implementations/visitorFunctions/false';
import visitFormal from './Implementations/visitorFunctions/formal';
import visitId from './Implementations/visitorFunctions/id';
import visitInt from './Implementations/visitorFunctions/int';
import visitIsvoid from './Implementations/visitorFunctions/isVoid';
import visitLessEqual from './Implementations/visitorFunctions/lessEqual';
import visitLessThan from './Implementations/visitorFunctions/lessThan';
import { HelperFunctions, ParseTreeProperties } from './Implementations/visitorFunctions/meta';
import visitMethod from './Implementations/visitorFunctions/method';
import visitMethodCall from './Implementations/visitorFunctions/methodCall';
import visitMinus from './Implementations/visitorFunctions/minus';
import visitMultiply from './Implementations/visitorFunctions/multiply';
import visitNegative from './Implementations/visitorFunctions/negative';
import visitNew from './Implementations/visitorFunctions/new';
import visitOwnMethodCall from './Implementations/visitorFunctions/ownMethodCall';
import visitParentheses from './Implementations/visitorFunctions/parentheses';
import visitProperty from './Implementations/visitorFunctions/property';
import visitString from './Implementations/visitorFunctions/string';
import visitTrue from './Implementations/visitorFunctions/true';
import visitWhile from './Implementations/visitorFunctions/while';

export enum Scope {
  Global = 1,
  General,
}

export const lineAndColumn = (ctx: any): { line: number; column: number } => ({
  line: ctx.start?.line ?? 0,
  column: ctx.start?.charPositionInLine ?? 0,
});

export class YaplVisitor
  extends AbstractParseTreeVisitor<any>
  implements yaplVisitor<any>, HelperFunctions, ParseTreeProperties {
  public scopeStack: Stack<CompositionComponent>;
  public symbolsTable: TableComponent<TypeComponent>;
  public mainExists: boolean = false;
  public mainMethodExists: boolean = false;
  public errors: BasicStorage<IError>;

  //#region Metadata

  constructor() {
    super();
    this.scopeStack = new Stack<TypeComponent>(); // Scopes are implemented as a stack.
    this.symbolsTable = new TableComponent<TypeComponent>(); // Symbols are universal
    this.errors = new BasicStorage<IError>();
    const objectType = new ObjectType();
    const intType = new IntType();
    const stringType = new StringType();
    const boolType = new Bool();
    const ioType = new IOType();

    this.scopeStack.push(new ObjectType());
    this.symbolsTable.add(objectType, intType, stringType, boolType, ioType);
  }
  defaultResult(): any {
    return [];
  }

  protected aggregateResult(aggregate: any, nextResult: any) {
    if (Array.isArray(nextResult)) {
      return [...(aggregate ?? []), ...(nextResult ?? [])];
    }
    return [...aggregate, nextResult];
  }

  addError(ctx: any, errorMessage: string) {
    const coloredRedMessage = errorMessage.replace('{{{', '\x1b[31m').replace('}}}', '\x1b[0m');
    const coloredBlueMessage = coloredRedMessage.replace('{{', '\x1b[34m').replace('}}', '\x1b[0m');
    const coloredGreenMessage = coloredBlueMessage.replace('{', '\x1b[32m').replace('}', '\x1b[0m');
    const { line, column } = lineAndColumn(ctx);
    this.errors.add({ line, column, message: coloredGreenMessage });
  }

  findTable(name: string | TypeComponent | any): ClassType | null {
    return this.symbolsTable.get(name.toString(), { inCurrentScope: true }) as ClassType;
  }

  returnToScope(scope: Scope) {
    while (this.scopeStack.size() > scope) {
      this.scopeStack.pop();
    }
  }

  next = (ctx: any) => super.visitChildren(ctx);

  returnToGlobalScope() {
    this.returnToScope(Scope.Global);
  }

  // The second scope in the stack is always a class
  getCurrentScope<T = ClassType | MethodElement>(): T {
    return this.scopeStack.getItem(this.scopeStack.size() - 1) as T;
  }

  //#endregion

  visitClassDefine = (ctx: ClassDefineContext) => {
    return visitClassDefine(this, ctx);
  };

  visitMethodCall = (ctx: MethodCallContext) => {
    return visitMethodCall(this, ctx); 
  };

  visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
    return visitOwnMethodCall(this, ctx);
  };

  // // The first if (the one on top of the stack) defines the type, the others follow it
  // visitIf = (ctx: IfContext) => {
  //   // Empty bodies are disallowed by the parser in itself
  //   const [condition, body, elses] = ctx.expression();
  //   const conditionType = this.visit(condition);
  //   const boolTable: Table<boolean> = this.findTable("Bool")!;

  //   // ERROR: Condition can't be resolved to boolean
  //   if (!boolTable.allowsAssignmentOf(conditionType)) {
  //     this.addError(
  //       ctx,
  //       `Condition in if statement can't be resolved to boolean (got ${conditionType.tableName})`
  //     );
  //   }
  //   const thisIfType = this.visit(body);
  //   const elseBodiesType = this.visit(elses);
  //   // ERROR: If and else bodies don't have the same type
  //   const [allowsAssignment] = thisIfType.allowsAssignmentOf(elseBodiesType);
  //   const isAncestor = thisIfType.isAncestorOf(elseBodiesType);
  //   if (!allowsAssignment && !isAncestor) {
  //     this.addError(
  //       ctx,
  //       `If and else bodies don't have the same type (got ${thisIfType.tableName} and ${elseBodiesType.tableName})`
  //     );
  //   }
  //   return thisIfType;
  // };

  visitWhile = (ctx: WhileContext) => {
    return visitWhile(this, ctx);
  };

  visitBlock = (ctx: BlockContext) => {
    return visitBlock(this, ctx);
  };

  visitNew = (ctx: NewContext) => {
    return visitNew(this, ctx);
  };

  visitNegative = (ctx: NegativeContext) => {
    return visitNegative(this, ctx);
  };

  visitIsvoid = (ctx: IsvoidContext) => {
    return visitIsvoid(this, ctx);
  };

  visitMultiply = (ctx: MultiplyContext) => { 
    return visitMultiply(this, ctx);
  };

  visitDivision = (ctx: DivisionContext) => { 
    return visitDivision(this, ctx);
  };
  visitAdd = (ctx: AddContext) => { 
    return visitAdd(this, ctx);
  };
  visitMinus = (ctx: MinusContext) => { 
    return visitMinus(this, ctx);
  };

  // Less thans return booleans.
  visitLessThan = (ctx: LessThanContext) => { 
    return visitLessThan(this, ctx);
  };

  visitLessEqual = (ctx: LessEqualContext) => { 
    return visitLessEqual(this, ctx);
  };
  visitEqual = (ctx: EqualContext) => { 
    return visitEqual(this, ctx);
  };

  visitParentheses = (ctx: ParenthesesContext) => { 
    return visitParentheses(this, ctx);
  };

  visitId = (ctx: IdContext) => { 
    return visitId(this, ctx);
  };

  visitInt = (ctx: IntContext) => { 
    return visitInt(this, ctx);
  };

  visitString = (ctx: StringContext) => { 
    return visitString(this, ctx);
  };

  visitTrue = (ctx: TrueContext) => { 
    return visitTrue(this, ctx);
  };

  visitFalse = (ctx: FalseContext) => { 
    return visitFalse(this, ctx);
  };

  visitAssignment = (ctx: AssignmentContext) => { 
    return visitAssignment(this, ctx);
  };

  visitMethod = (ctx: MethodContext) => { 
    return visitMethod(this, ctx);
  };

  visitProperty = (ctx: PropertyContext) => { 
    return visitProperty(this, ctx);
  };

  visitFormal = (ctx: FormalContext) => { 
    return visitFormal(this, ctx);
  };
}
