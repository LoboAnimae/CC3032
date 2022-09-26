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
} from './antlr/yaplParser';
import { yaplVisitor } from './antlr/yaplVisitor';
import { Stack } from './Implementations/DataStructures/Stack';
import {
  BasicInfoComponent,
  CompositionComponent,
  EmptyComponent,
  extractTableComponent,
  extractTypeComponent,
  TableComponent,
  TypeComponent,
} from './Implementations/Components/index';
import ValueComponent, { extractValueComponent } from './Implementations/Components/ValueHolder';
import { MethodElement, SymbolElement, TableElementType } from './Implementations/DataStructures/TableElements/index';
import { BasicStorage, IError } from './Implementations/Errors/Errors';
import Bool from './Implementations/Generics/Boolean.type';
import { default as IntType } from './Implementations/Generics/Integer.type';
import { IOType } from './Implementations/Generics/IO.type';
import { ClassType, ObjectType } from './Implementations/Generics/Object.type';
import { StringType } from './Implementations/Generics/String.type';
import ComponentInformation from './Implementations/Components/ComponentInformation';
import { HelperFunctions, ParseTreeProperties } from './Implementations/visitorFunctions/meta';
import visitClassDefine from './Implementations/visitorFunctions/classDefine';
import visitOwnMethodCall from './Implementations/visitorFunctions/ownMethodCall';

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
  implements yaplVisitor<any>, HelperFunctions, ParseTreeProperties
{
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
    const methodType = ctx.TYPE();
    const methodName = ctx.IDENTIFIER();
    const [variableName, ...methodParametersRaw] = ctx.expression();
    const methodParameters: SymbolElement[] = methodParametersRaw.map((p: any) => this.visit(p));
    const variable = this.visit(variableName);

    // ERROR: Variable is not defined
    if (!variable) {
      return this.next(ctx);
    }

    // const { BasicInfo, Type, Table } = ComponentInformation.components;
    // const methodHoldingClass = (() => {
    //   const isSelf = variableName.text.toLocaleLowerCase() === 'self';
    //   if (isSelf) {
    //     return this.getCurrentScope();
    //   }
    //   if (this.findTable(methodType)) {

    //   }
    // })();

    // const methodHoldingClass =
    //   variableName.text.toLocaleLowerCase() === 'self'
    //     ? this.getCurrentScope()
    //     : this.findTable(ctx.TYPE()) ?? this.getCurrentScope().get(variableName.text)?.getType();

    // // ERROR: The method holding the class does not exist
    // if (!methodHoldingClass) {
    //   this.addError(
    //     ctx,
    //     `Attempting to call method from non-existing class (class ${ctx.TYPE()} does not exist or is not yet defined)`,
    //   );
    //   return this.next(ctx);
    // }
    // const isAncestor = methodHoldingClass.isAncestorOf(variable);

    // // ERROR: A class is able to call only its own methods or it's parents methods
    // if (!isAncestor) {
    //   this.addError(
    //     ctx,
    //     `Attempting to call method from class ${methodHoldingClass.tableName} from class ${variable.tableName}, but ${variable.tableName} is not a child of ${methodHoldingClass.tableName}`,
    //   );
    // }

    // const calledMethod = ctx.IDENTIFIER();
    // const referencedMethod = methodHoldingClass.find(calledMethod.text) as MethodElement;

    // // ERROR: The method does not exist in the class (self or not)
    // if (!referencedMethod) {
    //   this.addError(
    //     ctx,
    //     `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`,
    //   );
    //   return this.next(ctx);
    // }

    // const requiredMethodParameters: SymbolElement[] = referencedMethod.getParameters() ?? [];
    // const sameNumberOfParameters = requiredMethodParameters.length === methodParameters.length;

    // // ERROR: The method is called with a different number of parameters than it requires
    // if (!sameNumberOfParameters) {
    //   this.addError(
    //     ctx,
    //     `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`,
    //   );
    //   return this.next(ctx);
    // }

    // for (let i = 0; i < requiredMethodParameters.length; i++) {
    //   const requiredParameterType = requiredMethodParameters[i].getType();
    //   const methodParameterType = methodParameters[i];
    //   const [allowed] = requiredParameterType.allowsAssignmentOf(methodParameterType);
    //   // ERROR: The parameter required is not the same as the one passed
    //   if (!allowed) {
    //     this.addError(
    //       ctx,
    //       `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`,
    //     );
    //   }
    // }
    // return referencedMethod.getType();
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

  // visitWhile = (ctx: WhileContext) => {
  //   const expressionToCast = ctx.children?.[1];

  //   // There is no expression inside the while loop
  //   if (!expressionToCast) {
  //     return this.next(ctx);
  //   }
  //   const foundExpression: Table<boolean> = this.visit(expressionToCast);
  //   const boolTable = this.findTable("Bool")!;
  //   const [allowsAssignment] = boolTable.allowsAssignmentOf(foundExpression);
  //   // ERROR: The expression inside the while loop cannot be set as a boolean expression
  //   if (!allowsAssignment) {
  //     this.addError(
  //       ctx,
  //       `Expression inside while loop cannot be set as a boolean expression (got ${foundExpression.tableName})`
  //     );
  //     this.next(ctx);
  //   }
  //   return this.findTable("Object")!;
  // };

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

  visitMultiply = (ctx: MultiplyContext) => {};

  visitDivision = (ctx: DivisionContext) => {};
  visitAdd = (ctx: AddContext) => {};
  visitMinus = (ctx: MinusContext) => {};

  // Less thans return booleans.
  visitLessThan = (ctx: LessThanContext) => {};

  visitLessEqual = (ctx: LessEqualContext) => {};
  visitEqual = (ctx: EqualContext) => {};

  visitParentheses = (ctx: ParenthesesContext) => {};

  visitId = (ctx: IdContext) => {};

  visitInt = (ctx: IntContext): CompositionComponent => {};

  visitString = (ctx: StringContext): CompositionComponent => {};

  visitTrue = (_ctx: TrueContext): CompositionComponent => {};

  visitFalse = (_ctx: FalseContext): CompositionComponent => {};

  visitAssignment = (ctx: AssignmentContext) => {};

  visitMethod = (ctx: MethodContext) => {};

  visitProperty = (p_ctx: PropertyContext) => {};

  visitFormal = (ctx: FormalContext) => {
    const paramName = ctx.IDENTIFIER();
    const dataType = ctx.TYPE();
    const foundTable: CompositionComponent | null | undefined = this.findTable(dataType)?.copy();

    // ERROR: The type is not yet defined
    if (!foundTable) {
      this.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
      return new EmptyComponent();
    }
    const newSymbol = new SymbolElement({
      name: paramName.text,
      type: foundTable,
      ...lineAndColumn(ctx),
    });
    return newSymbol;
  };
}
