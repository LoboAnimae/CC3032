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
  MethodContext,
  MinusContext,
  MultiplyContext,
  NegativeContext,
  NewContext,
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
  TableComponent,
  TypeComponent,
} from './Implementations/Components/index';
import ValueHolder from './Implementations/Components/ValueHolder';
import Bool from './Implementations/Generics/Boolean.type';
import { default as Integer, default as IntType } from './Implementations/Generics/Integer.type';
import { IOType } from './Implementations/Generics/IO.type';
import { ObjectType, ClassType } from './Implementations/Generics/Object.type';
import { StringType } from './Implementations/Generics/String.type';
import { MethodElement, SymbolElement, TableElementType } from './Implementations/DataStructures/TableElements/index';
import { BasicStorage, IError } from './Implementations/Errors/Errors';
import { Primitive } from './Implementations/Generics/Primitive.type';
import ComponentInformation from './Implementations/Components/ComponentInformation';
import TableElement from './Implementations/DataStructures/TableElements/TableElement';

enum Scope {
  Global = 1,
  General,
}

export class YaplVisitor extends AbstractParseTreeVisitor<any> implements yaplVisitor<any> {
  public scopeStack: Stack<CompositionComponent>;
  public symbolsTable: TableComponent<TypeComponent>;
  public mainExists: boolean = false;
  public mainMethodExists: boolean = false;
  public errors: BasicStorage<IError>;
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

  lineAndColumn = (ctx: any): { line: number; column: number } => ({
    line: ctx.start?.line ?? 0,
    column: ctx.start?.charPositionInLine ?? 0,
  });

  addError(ctx: any, errorMessage: string) {
    const coloredRedMessage = errorMessage.replace('{{{', '\x1b[31m').replace('}}}', '\x1b[0m');
    const coloredBlueMessage = coloredRedMessage.replace('{{', '\x1b[34m').replace('}}', '\x1b[0m');
    const coloredGreenMessage = coloredBlueMessage.replace('{', '\x1b[32m').replace('}', '\x1b[0m');
    const { line, column } = this.lineAndColumn(ctx);
    this.errors.add({ line, column, message: coloredGreenMessage });
  }

  protected findTable(name: string | TypeComponent | any): ClassType | null {
    return this.symbolsTable.get(name.toString(), { inCurrentScope: true }) as ClassType;
  }

  protected returnToScope(scope: Scope) {
    while (this.scopeStack.size() > scope) {
      this.scopeStack.pop();
    }
  }

  next = (ctx: any) => super.visitChildren(ctx);

  private returnToGlobalScope() {
    this.returnToScope(Scope.Global);
  }

  // // The second scope in the stack is always a class
  private getCurrentScope<T = ClassType | MethodElement>(): T {
    return this.scopeStack.getItem(this.scopeStack.size() - 1) as T;
  }
  visitClassDefine = (ctx: ClassDefineContext) => {
    this.returnToGlobalScope();
    const { Object } = ComponentInformation.type;
    const { BasicInfo, Type } = ComponentInformation.components;
    const [cls, inheritsFrom = Object.name] = ctx.TYPE();
    // ERROR: Class inherits from itself
    if (cls.toString() === inheritsFrom) {
      return this.next(ctx);
    }
    const classTable = this.findTable(cls);
    // ERROR: Class already exists
    if (classTable) {
      const typeComponent = classTable.getComponent<TypeComponent>({ componentType: Type.type })!;
      if (typeComponent.isGeneric) {
        this.addError(ctx, `Generic class ${cls} can't be redefined`);
      } else {
        this.addError(ctx, `Redefinition of class ${cls}`);
      }
      return this.next(ctx);
    }
    let parentTable: ClassType | null = this.findTable(inheritsFrom);
    const typeTableComponent = parentTable?.getComponent<TypeComponent>({ componentType: Type.type })!;
    // ERROR: Trying to inherit from a non-existing class
    if (!parentTable) {
      this.addError(ctx, `Class ${cls} is trying to inherit from class ${inheritsFrom}, which does not exist`);
      parentTable = this.findTable(Object.name)!; // Shift back to Object as a failsafe
    }
    // ERROR: The table can't be inherited
    else if (!typeTableComponent) {
      this.addError(ctx, `Class ${cls} is trying to inherit from class ${inheritsFrom}, which is not a type`);
      return this.next(ctx);
    } else if (typeTableComponent.isGeneric) {
      this.addError(ctx, `Class ${cls} is trying to inherit from generic class ${inheritsFrom}`);
      return this.next(ctx);
    }
    const newTable = parentTable.createChild();
    const basicComponent = newTable.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;
    basicComponent.setName(cls.toString());
    if (basicComponent.getName() === 'Main') {
      // ERROR: Main class is declared more than once
      if (this.mainExists) {
        this.addError(ctx, 'Main class is declared more than once');
        return this.next(ctx);
      }
      this.mainExists = true;
      // ERROR: Main class is trying to inherit from another class, which is not allowed
      if (parentTable?.componentName !== Object.name) {
        this.addError(ctx, `Main class can't inherit from ${inheritsFrom} (Main class can only inherit from Object)`);
      }
    }
    // Push the table to the stack and the table to the list of tables
    this.symbolsTable.add(newTable);
    this.scopeStack.push(newTable);
    return this.next(ctx);
  };

  // visitMethodCall = (ctx: MethodCallContext) => {
  //   const [variableName, ...methodParametersRaw] = ctx.expression();
  //   const methodParameters: Table<any>[] = methodParametersRaw.map((p) =>
  //     this.visit(p)
  //   );
  //   const variable = this.visit(variableName);

  //   // ERROR: Variable is not defined
  //   if (!variable) {
  //     return this.next(ctx);
  //   }

  //   const methodHoldingClass: Table<any> | undefined =
  //     variableName.text.toLocaleLowerCase() === "self"
  //       ? this.getCurrentScope()
  //       : this.findTable(ctx.TYPE()) ??
  //         this.getCurrentScope().find(variableName.text)?.getType();

  //   // ERROR: The method holding the class does not exist
  //   if (!methodHoldingClass) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call method from non-existing class (class ${ctx.TYPE()} does not exist or is not yet defined)`
  //     );
  //     return this.next(ctx);
  //   }
  //   const isAncestor = methodHoldingClass.isAncestorOf(variable);

  //   // ERROR: A class is able to call only its own methods or it's parents methods
  //   if (!isAncestor) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call method from class ${methodHoldingClass.tableName} from class ${variable.tableName}, but ${variable.tableName} is not a child of ${methodHoldingClass.tableName}`
  //     );
  //   }

  //   const calledMethod = ctx.IDENTIFIER();
  //   const referencedMethod = methodHoldingClass.find(
  //     calledMethod.text
  //   ) as MethodElement;

  //   // ERROR: The method does not exist in the class (self or not)
  //   if (!referencedMethod) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`
  //     );
  //     return this.next(ctx);
  //   }

  //   const requiredMethodParameters: SymbolElement[] =
  //     referencedMethod.getParameters() ?? [];
  //   const sameNumberOfParameters =
  //     requiredMethodParameters.length === methodParameters.length;

  //   // ERROR: The method is called with a different number of parameters than it requires
  //   if (!sameNumberOfParameters) {
  //     this.addError(
  //       ctx,
  //       `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`
  //     );
  //     return this.next(ctx);
  //   }

  //   for (let i = 0; i < requiredMethodParameters.length; i++) {
  //     const requiredParameterType = requiredMethodParameters[i].getType();
  //     const methodParameterType = methodParameters[i];
  //     const [allowed] =
  //       requiredParameterType.allowsAssignmentOf(methodParameterType);
  //     // ERROR: The parameter required is not the same as the one passed
  //     if (!allowed) {
  //       this.addError(
  //         ctx,
  //         `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`
  //       );
  //     }
  //   }
  //   return referencedMethod.getType();
  // };

  // visitOwnMethodCall = (ctx: OwnMethodCallContext) => {
  //   const calledMethod = ctx.IDENTIFIER();
  //   const [...methodParametersRaw] = ctx.expression();
  //   const methodParameters: Table<any>[] = methodParametersRaw.map((p) =>
  //     this.visit(p)
  //   );
  //   const methodHoldingClass = this.getCurrentScope();

  //   const referencedMethod = methodHoldingClass.find(
  //     calledMethod.text
  //   ) as MethodElement;

  //   // ERROR: The method does not exist in the class (self or not)
  //   if (!referencedMethod) {
  //     this.addError(
  //       ctx,
  //       `Attempting to call non-existing method ${calledMethod.text} from class ${methodHoldingClass.tableName}`
  //     );
  //     return this.next(ctx);
  //   }

  //   const requiredMethodParameters: SymbolElement[] =
  //     referencedMethod.getParameters() ?? [];
  //   const sameNumberOfParameters =
  //     requiredMethodParameters.length === methodParameters.length;

  //   // ERROR: The method is called with a different number of parameters than it requires
  //   if (!sameNumberOfParameters) {
  //     this.addError(
  //       ctx,
  //       `Incorrect number of parameters for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredMethodParameters.length}, got ${methodParameters.length})`
  //     );
  //     return this.next(ctx);
  //   }

  //   for (let i = 0; i < requiredMethodParameters.length; i++) {
  //     const requiredParameterType = requiredMethodParameters[i].getType();
  //     const methodParameterType = methodParameters[i];
  //     const [allowed] =
  //       requiredParameterType.allowsAssignmentOf(methodParameterType);
  //     // ERROR: The parameter required is not the same as the one passed
  //     if (!allowed) {
  //       this.addError(
  //         ctx,
  //         `Incorrect type of parameter ${requiredMethodParameters[i].name} for method ${calledMethod.text} from class ${methodHoldingClass.tableName} (expected ${requiredParameterType.tableName}, got ${methodParameterType.tableName})`
  //       );
  //     }
  //   }
  //   return referencedMethod.getType();
  // };

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
    // Return only the last thing in the block
    const resultingExpression = this.visitChildren(ctx);
    if (!resultingExpression) {
      this.addError(ctx, 'Empty code block');
      return new EmptyComponent();
    }
    const lastChild = Array.isArray(resultingExpression) ? resultingExpression.at(-1) : resultingExpression;
    return lastChild;
  };

  visitNew = (ctx: NewContext) => {
    const instantiationOf = ctx.TYPE();
    const { Type, BasicInfo } = ComponentInformation.components;

    const currentClass: ClassType | MethodElement = this.getCurrentScope();
    const currentClassBasicComponent = currentClass.getComponent<BasicInfoComponent>({
      componentType: BasicInfo.type,
    })!;

    const instantiatingClass = this.findTable(instantiationOf.text) as ClassType | undefined;
    const instantiatingType = instantiatingClass?.getComponent<TypeComponent>({ componentType: Type.type })!;
    const instantiatingBasicComponent = instantiatingClass?.getComponent<BasicInfoComponent>({
      componentType: BasicInfo.type,
    })!;

    if (!instantiatingType) {
      this.addError(ctx, `Cannot instantiate non-existing class ${instantiationOf.text}`);
      return new EmptyComponent();
    } else if (!instantiatingBasicComponent) {
      throw new Error('Bug! Instantiating class has no basic info component');
    } else if (currentClassBasicComponent.getName() === instantiatingBasicComponent.getName()) {
      this.addError(ctx, `Attempting to instantiate ${currentClassBasicComponent.getName()} inside itself`);
      return new EmptyComponent();
    }
    return instantiatingClass;
  };

  visitNegative = (ctx: NegativeContext) => {
    const expressionRaw = ctx.expression();
    const expressionType: TypeComponent = this.visit(expressionRaw);
    const { BasicInfo } = ComponentInformation.components;
    const basicInformationComponent = expressionType.getComponent<BasicInfoComponent>({
      componentType: BasicInfo.type,
    });
    if (!basicInformationComponent) {
      throw new Error('Semantic bug: expression type does not have basic information');
    }
    // ERROR: Expression can't be negated
    if (!expressionType.allowsNegation) {
      this.addError(
        ctx,
        `Expression ${basicInformationComponent.getName()} of type ${expressionType.componentType} can't be negated`,
      );
    }
    return this.next(ctx);
  };

  visitIsvoid = (ctx: IsvoidContext) => {
    const expressionRaw = ctx.expression();
    const expressionType: TypeComponent = this.visit(expressionRaw);

    const { Class } = ComponentInformation.components;
    const { Object } = ComponentInformation.type;
    // ERROR: Something that can't be instantiated can't be void
    if (![Class.name, Object.name].includes(expressionType.componentName)) {
      this.addError(
        ctx,
        `Something of type ${expressionType.componentName} can't be void (Make sure it can be instantiated with 'new')`,
      );
    }
    return expressionType;
  };

  visitMultiply = (ctx: MultiplyContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };

  visitDivision = (ctx: DivisionContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };
  visitAdd = (ctx: AddContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };
  visitMinus = (ctx: MinusContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };

  // Less thans return booleans.
  visitLessThan = (ctx: LessThanContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };

  visitLessEqual = (ctx: LessEqualContext) => {
    // Must be done between two possible integers
    // TODO: Add value
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };
  visitEqual = (ctx: EqualContext) => {
    // TODO: Add value
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const { Type } = ComponentInformation.components;
    const boolTable = this.findTable('Bool')!.copy();

    const lExpr: TypeComponent | null | undefined = (
      this.visit(leftChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    const rExpr: TypeComponent | null | undefined = (
      this.visit(rightChild) as CompositionComponent
    )?.getComponent<TypeComponent>({ componentType: Type.type });
    if (!lExpr || !rExpr) {
      this.addError(ctx, `One of the expressions is not a type`);
      return new EmptyComponent();
    }

    const allowedComparison = lExpr.allowsComparisonTo(rExpr);

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
      this.addError(ctx, `Invalid Comparison: ${leftChild.toString()} = ${rightChild.toString()}`);
      return new EmptyComponent();
    }
    return boolTable;
  };

  visitParentheses = (ctx: ParenthesesContext) => {
    return this.visit(ctx.expression());
  };

  visitId = (ctx: IdContext) => {
    // Find it in the scope
    const name = ctx.IDENTIFIER();
    const currentScope = this.getCurrentScope();
    const { Table, BasicInfo } = ComponentInformation.components;

    if (name.text.toLocaleLowerCase() === 'self') {
      return currentScope;
    }

    const tableComponent = currentScope.getComponent<TableComponent<TableElementType>>({ componentType: Table.type });
    if (!tableComponent) {
      return new EmptyComponent();
    }

    const foundComponent: TableElementType | null = tableComponent.get(name.text);

    if (!foundComponent) {
      const basicInfo = currentScope.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type });
      this.addError(ctx, `Symbol '${name.text}' is not defined in scope '${basicInfo!.name}'`);
      return new EmptyComponent();
    }

    return foundComponent;
  };

  visitInt = (ctx: IntContext): CompositionComponent => {
    const newInt = new IntType();
    newInt.addComponent(new ValueHolder({ value: parseInt(ctx.INT().text) }));
    return newInt;
  };

  visitString = (ctx: StringContext): CompositionComponent => {
    const newString = new StringType();
    const stringValue = new ValueHolder({ value: ctx.STRING().text });
    newString.addComponent(stringValue);
    return newString;
  };

  visitTrue = (_ctx: TrueContext): CompositionComponent => {
    const newBool = new Bool();
    const boolValue = new ValueHolder({ value: true });
    newBool.addComponent(boolValue);
    return newBool;
  };

  visitFalse = (_ctx: FalseContext): CompositionComponent => {
    const newBool = new Bool();
    const boolValue = new ValueHolder({ value: false });
    newBool.addComponent(boolValue);
    return newBool;
  };

  visitAssignment = (ctx: AssignmentContext) => {
    const { Table, BasicInfo, Type } = ComponentInformation.components;
    const assignmentTo = ctx.IDENTIFIER();
    const assignmentValue: CompositionComponent = this.visit(ctx.expression());
    const assignmentValueBasicInfo = assignmentValue.getComponent<BasicInfoComponent>({
      componentType: BasicInfo.type,
    });
    const currentScope = this.getCurrentScope()!;
    const currentScopeBasicInfo = currentScope.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type })!;

    const tableComponent = currentScope.getComponent<TableComponent<TableElementType>>({ componentType: Table.type })!;
    const foundSymbol: CompositionComponent | null = tableComponent.get(assignmentTo.text);
    const symbolBasicInformation = foundSymbol?.getComponent<BasicInfoComponent>({ componentType: BasicInfo.type });
    const symbolType = foundSymbol?.getComponent<TypeComponent>({ componentType: Type.type });
    // ERROR: The variable does not exist yet
    if (!foundSymbol) {
      this.addError(ctx, `Symbol ${assignmentTo.text} is not defined in scope ${currentScopeBasicInfo.getName()}`);
      return new EmptyComponent();
    }

    const allowed = symbolType?.allowsAssignmentOf(assignmentValue);
    if (!allowed) {
      this.addError(
        ctx,
        `Cannot assign ${assignmentValueBasicInfo?.getName()} to ${symbolBasicInformation?.getName()}`,
      );
    }
    return new EmptyComponent(); // Assignments don't return anything
  };

  visitMethod = (ctx: MethodContext) => {
    const methodName = ctx.IDENTIFIER().text;
    const methodExpectedType = ctx.TYPE();
    const methodBody = ctx.expression();
    const { Type, Table, ValueHolder: ValueHolderComponent } = ComponentInformation.components;

    const methodTable =
      methodExpectedType.text === 'SELF_TYPE' ? this.getCurrentScope() : this.findTable(methodExpectedType);
    const methodType = methodTable?.getComponent<TypeComponent>({ componentType: Type.type });

    // ERROR: The method type is not yet defined (if ever)
    if (!methodType) {
      this.addError(ctx, `Method type ${methodExpectedType.text} is not defined`);
      return this.next(ctx);
    }
    const { line, column } = this.lineAndColumn(ctx);

    const newMethod = new MethodElement({
      name: methodName,
      type: methodType,
      column,
      line,
    });

    const currentTable: ClassType = this.getCurrentScope()!;
    const classTableComponent = currentTable.getComponent<TableComponent<TableElementType>>({
      componentType: Table.type,
    })!;

    const methodTableComponent = newMethod.getComponent<TableComponent<TableElementType>>({
      componentType: Table.type,
    })!;

    methodTableComponent.parent = classTableComponent;

    // If it doesn't exist, it is a syntax error
    const formalParameters = ctx.formal();
    this.scopeStack.push(newMethod);
    for (const param of formalParameters) {
      const newParam = this.visit(param);
      newMethod.addParameters(newParam);
    }

    const expressionResult: CompositionComponent = this.visit(methodBody);
    const expressionType = expressionResult.getComponent<TypeComponent>({ componentType: Type.type });
    const expressionValue = expressionResult.getComponent<ValueHolder>({ componentType: ValueHolderComponent.type });
    // ERROR: If the expression is not valid, an empty component is returned, and no type will be found
    if (!expressionType) {
      this.addError(ctx, `Expected expression to return '${methodExpectedType.text}' inside method '${methodName}'`);
      return this.next(ctx);
    }

    const canBeAssigned = methodType?.allowsAssignmentOf(expressionType);
    // ERROR: Last child and return type do not match or can't be assigned
    if (!canBeAssigned) {
      this.addError(ctx, `Cannot assign ${expressionType.componentName} to method of type ${methodType.componentName}`);
      return this.next(ctx);
    }

    if (expressionValue) {
      methodType.addComponent(new ValueHolder({ value: expressionValue.value }));
    }
    this.scopeStack.pop();
    classTableComponent.add(newMethod);

    return methodType;
  };

  visitProperty = (ctx: PropertyContext) => {
    // Previous table
    const name = ctx.IDENTIFIER();
    const dataType = ctx.TYPE();
    const assignmentExpression = ctx.expression();

    const previousClass: TypeComponent | null = this.findTable(dataType);
    // const previousClassCopy = previousClass?.copy(); // Create a copy that can go out of scope
    const { line, column } = this.lineAndColumn(ctx);

    // ERROR: The type is not yet defined
    if (!previousClass) {
      this.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
      return this.next(ctx);
    }

    const newTableElement = new SymbolElement({
      name: name.text,
      type: previousClass,
      column,
      line,
    });

    if (assignmentExpression) {
      const resolvesTo: CompositionComponent = this.visit(assignmentExpression);
      const allowedAssigmentTo = previousClass.allowsAssignmentOf(resolvesTo);
      // ERROR: Not allowed an assignment and the assignment is not to an ancestor
      if (!allowedAssigmentTo) {
        this.addError(
          ctx,
          `Cannot assign ${resolvesTo?.componentName ?? 'erroneous class'} to ${
            previousClass.componentName
          } (Can't assign type ${resolvesTo?.componentName ?? ''} to ${previousClass.componentName})`,
        );
        return this.next(ctx);
      }
      const { ValueHolder } = ComponentInformation.components;
      const valueHolder = resolvesTo.getComponent<ValueHolder>({ componentType: ValueHolder.type });
      newTableElement.addComponent(valueHolder?.copy());
    }

    const currentScope: ClassType | MethodElement = this.getCurrentScope();
    const { Table } = ComponentInformation.components;
    const currentScopeTable = currentScope.getComponent<TableComponent<TableElementType>>({
      componentType: Table.type,
    })!;

    const previousDeclared = currentScopeTable.get(name.text, { inCurrentScope: true });
    // // Case 1: Overriding (It does nothing)
    if (previousDeclared) {
      this.addError(ctx, `Property ${name.text} is already declared in ${currentScope.toString()}`);
      return this.next(ctx);
    }

    // ERROR: The variable was defined in a parent scope, but the definition type is not the same

    // Case 2: Declaration of a new property
    currentScopeTable.add(newTableElement);
    return this.next(ctx);
  };

  visitFormal = (ctx: FormalContext) => {
    const paramName = ctx.IDENTIFIER();
    const dataType = ctx.TYPE();
    const foundTable: CompositionComponent | null | undefined = this.findTable(dataType)?.copy();

    // ERROR: The type is not yet defined
    if (!foundTable) {
      this.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
      return new EmptyComponent();
    }

    const { line, column } = this.lineAndColumn(ctx);
    const newSymbol = new SymbolElement({
      name: paramName.text,
      type: foundTable,
      column,
      line,
    });
    return newSymbol;
  };
}
