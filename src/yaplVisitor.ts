import { yaplVisitor } from "./antlr/yaplVisitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import {
  AddContext,
  AssignmentContext,
  BlockContext,
  BoolNotContext,
  ClassDefineContext,
  ClassesContext,
  DivisionContext,
  EofContext,
  EqualContext,
  ExpressionContext,
  FalseContext,
  FeatureContext,
  FormalContext,
  IdContext,
  IfContext,
  IntContext,
  IsvoidContext,
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
  ParenthesesContext,
  ProgramBlocksContext,
  ProgramContext,
  PropertyContext,
  StringContext,
  TrueContext,
  WhileContext,
} from "./antlr/yaplParser";
import { Stack } from "./DataStructures/Stack";
import { ErrorsTable, MethodElement, Table, TableElement } from "./DataStructures/Table";
import { PropertyContextHelper } from "./yaplCheckpoint";
import { SymbolsTable } from "./Implementations/SymbolsTable";
import { IntegerType } from "./Implementations/Generics";
import BoolType from "./Implementations/Generics/Boolean.type";
import Integer from "./Implementations/Generics/Integer.type";
import { BasicInfoComponent, CompositionComponent, EmptyComponent, PositioningComponent, TableComponent, TypeComponent } from "./Implementations/Components/index";
import ValueHolderComponent from "./Implementations/Components/ValueHolder";
import { String } from "./Implementations/Generics/String.type";
import Bool from "./Implementations/Generics/Boolean.type";
import { ObjectType } from "./Implementations/Generics/Object.type";
import { IO } from "./Implementations/Generics/IO.type";
import { ClassType } from "./Implementations/DataStructures/Class.type";
import { Method, SymbolElement } from "./Implementations/DataStructures/Method.type";

enum Scope {
  Global = 1,
  General,
}

export class YaplVisitor extends AbstractParseTreeVisitor<any> implements yaplVisitor<any> {
  public scopeStack: Stack<CompositionComponent>;
  public symbolsTable: SymbolsTable;
  public mainExists: boolean = false;
  public mainMethodExists: boolean = false;
  public errors: ErrorsTable;
  constructor() {
    super();
    this.scopeStack = new Stack<TableComponent>(); // Scopes are implemented as a stack.
    this.symbolsTable = new SymbolsTable(); // Symbols are universal
    this.errors = new ErrorsTable();


    this.scopeStack.push(new ObjectType());
    this.symbolsTable.add(Integer.IntegerType, String.StringType, Bool.BoolType, IO.IOType, ObjectType.ObjectType);
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

  lineAndColumn = (ctx: any): { line: number, column: number } => ({
    line: ctx.start?.line ?? 0,
    column: ctx.start?.charPositionInLine ?? 0,
  });

  addError(ctx: any, errorMessage: string) {
    const coloredRedMessage = errorMessage.replace('{{{', '\x1b[31m').replace('}}}', '\x1b[0m');
    const coloredBlueMessage = coloredRedMessage.replace('{{', '\x1b[34m').replace('}}', '\x1b[0m');
    const coloredGreenMessage = coloredBlueMessage.replace('{', '\x1b[32m').replace('}', '\x1b[0m');
    const { line, column } = this.lineAndColumn(ctx);
    this.errors.addError({ line, column, message: coloredGreenMessage });
  }

  protected findTable(name: string | Table<any> | any): CompositionComponent | null {
    // if (typeof name === "string") {
    //   return this.symbolsTable.find(
    //     (table: Table<any>) => table.scope === name
    //   );
    // } else if (name instanceof Table) {
    //   return this.symbolsTable.find(
    //     (table: Table<any>) => table.scope === name.scope
    //   );
    // } else if (name) {
    //   return this.symbolsTable.find(
    //     (table: Table<any>) => table.scope === name.text ?? name.toString()
    //   );
    // }
    return this.symbolsTable.get(name.toString())
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
  private getCurrentScope<T = CompositionComponent>(): T {
    return this.scopeStack.getItem(this.scopeStack.size() - 1) as T;
  }
  visitClassDefine = (ctx: ClassDefineContext): number => {
    this.returnToGlobalScope();
    const [cls, inheritsFrom = "Object"] = ctx.TYPE();


    // ERROR: Class inherits from itself
    if (cls == inheritsFrom) {
      return this.next(ctx);
    }



    const classTable = this.findTable(cls);
    const { line, column } = this.lineAndColumn(ctx);


    // ERROR: Class already exists
    if (classTable) {
      const typeComponent = classTable.getComponent(TypeComponent)!;

      if (typeComponent.isGeneric) {
        this.addError(ctx, `Generic class ${cls} can't be redefined`);
      } else {
        this.addError(ctx, `Redefinition of class ${cls}`);
      }
      return this.next(ctx);
    }

    const parentTable = this.findTable(inheritsFrom);
    const typeTableComponent = parentTable?.getComponent(TypeComponent);
    // ERROR: Trying to inherit from a non-existing class
    if (!parentTable) {
      this.addError(
        ctx,
        `Class ${cls} is trying to inherit from class ${inheritsFrom}, which does not exist`
      );
    }
    // ERROR: The table can't be inherited

    if (!typeTableComponent) {
      this.addError(ctx, `Class ${cls} is trying to inherit from class ${inheritsFrom}, which is not a type`);
      return this.next(ctx)
    }
    else if (typeTableComponent.isGeneric) {
      this.addError(ctx, `Class ${cls} is trying to inherit from generic class ${inheritsFrom}`);
      return this.next(ctx)
    }

    const basicComponent = new BasicInfoComponent();
    const typeComponent = new TypeComponent({ name: cls.toString() });
    const classType = new ClassType({ basicComponent, typeComponent, name: cls.toString() });

    typeComponent.parent = parentTable?.getComponent(TypeComponent) ?? null;
    console.log(classType)

    // if (newTable.tableName === "Main") {
    //   // ERROR: Main class is declared more than once
    //   if (this.mainExists) {
    //     this.addError(ctx, "Main class is declared more than once");
    //     return this.next(ctx);
    //   }
    //   this.mainExists = this.mainExists || cls.text === "Main";
    //   // ERROR: Main class is trying to inherit from another class, which is not allowed
    //   if (parentTable?.tableName !== "Object") {
    //     this.addError(
    //       ctx,
    //       `Main class can't inherit from ${inheritsFrom} (Main class can only inherit from Object)`
    //     );
    //   }
    // }

    // Push the table to the stack and the table to the list of tables
    this.symbolsTable.add(classType);
    this.scopeStack.push(classType);
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
      this.addError(ctx, "Empty code block");
      return new EmptyComponent();
    }
    const lastChild = Array.isArray(resultingExpression)
      ? resultingExpression.at(-1)
      : resultingExpression;
    return lastChild;
  };

  // visitLetIn = (ctx: LetInContext) => {
  //   return this.next(ctx);
  // };

  visitNew = (ctx: NewContext) => {
    const currentClass: ClassType = this.getCurrentScope();
    const currentClassType = currentClass.getComponent(TypeComponent)!;


    const instantiationOf = ctx.TYPE();
    // Find a table with the same name as the type of the instantiation
    const instantiationOfTable = this.findTable(instantiationOf);
    const typeComponentTable = instantiationOfTable?.getComponent(TypeComponent);



    // ERROR: Trying to instantiate a non-existing class
    if (!instantiationOfTable) {
      this.addError(
        ctx,
        `Trying to instantiate a non-existing class ${instantiationOf.text}`
      );
      return new EmptyComponent();
    }
    if (!typeComponentTable) {
      this.addError(ctx, `Trying to instantiate a non-type ${instantiationOf.text}`);
    } else if (!typeComponentTable.isGeneric && !(instantiationOfTable instanceof ClassType)) {
      this.addError(ctx, `Trying to instantiate a non-class ${instantiationOf.text}`);
    }
    // ERROR: Trying to instantiate the class we're currently in
    else if (typeComponentTable.name === currentClassType.name) {
      this.addError(
        ctx,
        `Attempting to instantiate class ${typeComponentTable.name} inside itself`
      );
      return new EmptyComponent();
    }



    return instantiationOfTable;
  };

  // visitNegative = (ctx: NegativeContext) => {
  //   const expressionRaw = ctx.expression();
  //   const expressionType: Table<any> = this.visit(expressionRaw);

  //   // ERROR: Expression can't be negated
  //   if (!expressionType.allowNegation) {
  //     this.addError(
  //       ctx,
  //       `Expression of type ${expressionType.tableName} can't be negated`
  //     );
  //   }
  //   return this.next(ctx);
  // };
  // visitIsvoid = (ctx: IsvoidContext) => {
  //   const expressionRaw = ctx.expression();
  //   const expressionType = this.visit(expressionRaw);
  //   const cantBeInstantiated = ["Int", "Bool", "String", "IO"];

  //   // ERROR: Something that can't be instantiated can't be void
  //   if (cantBeInstantiated.includes(expressionType.tableName)) {
  //     this.addError(
  //       ctx,
  //       `Something of type ${expressionType.tableName} can't be void (Make sure it can be instantiated with 'new')`
  //     );
  //   }
  //   return expressionType;
  // };
  visitMultiply = (ctx: MultiplyContext) => {
    const lExpr: CompositionComponent = this.visit(ctx.children![0]!);
    const rExpr: CompositionComponent = this.visit(ctx.children![2]!);

    const IntegerVal = new Integer();
    
    const lCanBeInt = IntegerVal.allowsAssignmentOf(lExpr);
    const rCanBeInt = IntegerVal.allowsAssignmentOf(rExpr);

    // ERROR: One of the expressions cannot be set as an integer
    if (!lCanBeInt || !rCanBeInt) {
      this.addError(
        ctx,
        `One of the expressions cannot be set as an integer (got ${lExpr.componentName} and ${rExpr.componentName})`
      );
      return undefined;
    }

    const lValue = lExpr.getComponent(ValueHolderComponent);
    const rValue = rExpr.getComponent(ValueHolderComponent);

    if (lValue && rValue) {
      const value = lValue.value * rValue.value;
      IntegerVal.addComponent(new ValueHolderComponent({value}))
    }
    return IntegerVal
  };
  // visitDivision = (ctx: DivisionContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value / rExpr.value);
  // };
  // visitAdd = (ctx: AddContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value + rExpr.value);
  // };
  // visitMinus = (ctx: MinusContext) => {
  //   const lExpr: Table<any> = this.visit(ctx.children![0]!);
  //   const rExpr: Table<any> = this.visit(ctx.children![2]!);

  //   const intTable: Table<number> = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return intTable.setValue(lExpr.value - rExpr.value);
  // };

  // // Less thans return booleans.
  // visitLessThan = (ctx: LessThanContext) => {
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);

  //   const intTable = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );

  //     return undefined;
  //   }
  //   return this.findTable("Bool")!
  //     .copy()
  //     .setValue(lExpr.value < rExpr.value);
  // };

  // visitLessEqual = (ctx: LessEqualContext) => {
  //   // Must be done between two possible integers
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);
  //   const { line, column } = this.lineAndColumn(ctx);

  //   const intTable = this.findTable("Int")!.copy();

  //   const [lCanBeInt] = intTable.allowsAssignmentOf(lExpr);
  //   const [rCanBeInt] = intTable.allowsAssignmentOf(rExpr);

  //   // ERROR: One of the expressions cannot be set as an integer
  //   if (!lCanBeInt || !rCanBeInt) {
  //     this.addError(
  //       ctx,
  //       `One of the expressions cannot be set as an integer (got ${lExpr.tableName} and ${rExpr.tableName})`
  //     );
  //     return undefined;
  //   }
  //   return this.findTable("Bool")!
  //     .copy()
  //     .setValue(lExpr.value <= rExpr.value);
  // };
  // visitEqual = (ctx: EqualContext) => {
  //   // Must be done between two possible integers
  //   const [leftChild, rightChild] = ctx.expression();
  //   const lExpr: Table<number> = this.visit(leftChild);
  //   const rExpr: Table<number> = this.visit(rightChild);
  //   const { line, column } = this.lineAndColumn(ctx);

  //   const [allowed] = lExpr.allowsAssignmentOf(rExpr);
  //   const lAncestorOf = lExpr.isAncestorOf(rExpr);
  //   const rAncestorOf = rExpr.isAncestorOf(lExpr);

  //   // ERROR: If one of them is an ancestor of the other, they can be compared
  //   if (!allowed && !lAncestorOf && !rAncestorOf) {
  //     this.addError(
  //       ctx,
  //       `Cannot compare ${lExpr.tableName} and ${rExpr.tableName}`
  //     );
  //     return undefined;
  //   }
  //   return this.findTable("Bool")!.copy();
  // };
  // visitParentheses = (ctx: ParenthesesContext) => {
  //   return this.visit(ctx.expression());
  // };
  visitId = (ctx: IdContext) => {
    // Find it in the scope
    const name = ctx.IDENTIFIER();
    if (name.text.toLocaleLowerCase() === "self") {
      return this.getCurrentScope();
    }
    const currentScope = this.getCurrentScope<CompositionComponent>()!;
    const tableComponent = currentScope.getComponent(TableComponent);
    if (!tableComponent) {
      return new EmptyComponent();
    }
    // const foundSymbol = currentScope.find(name.text);
    const foundComponent = tableComponent.get(name.text);
    // The ID is being used, but it wasn't defined yet
    if (!foundComponent) {
      this.addError(
        ctx,
        `Symbol '${name.text}' is not defined in scope '${currentScope.getComponent(BasicInfoComponent)!.name}'`
      );
      return new EmptyComponent();
    }
    return foundComponent;
    // return this.findTable(foundSymbol?.getType()!);
  };
  visitInt = (ctx: IntContext): CompositionComponent => {
    const newInt = new Integer();
    newInt.addComponent(new ValueHolderComponent({ value: parseInt(ctx.INT().text) }));
    return newInt;
  };

  visitString = (ctx: StringContext): CompositionComponent => {
    const newString = new String();
    const stringValue = new ValueHolderComponent({ value: ctx.STRING().text });
    newString.addComponent(stringValue);
    return newString;
  };
  visitTrue = (_ctx: TrueContext): CompositionComponent => {
    const newBool = new Bool();
    const boolValue = new ValueHolderComponent({ value: true });
    newBool.addComponent(boolValue);
    return newBool;
  };
  visitFalse = (_ctx: FalseContext): CompositionComponent => {
    const newBool = new Bool();
    const boolValue = new ValueHolderComponent({ value: false });
    newBool.addComponent(boolValue);
    return newBool;
  };
  visitAssignment = (ctx: AssignmentContext) => {
    const assignmentTo = ctx.IDENTIFIER();
    const assignmentValue: CompositionComponent = this.visit(ctx.expression());
    const currentScope = this.getCurrentScope()!.as(Method)!;
    const tableComponent = currentScope.getComponent(TableComponent)!;
    const foundSymbol: CompositionComponent | null = tableComponent.get(assignmentTo.text);
    // // ERROR: The variable does not exist yet
    if (!foundSymbol) {
      this.addError(
        ctx,
        `Symbol ${assignmentTo.text} is not defined in scope ${currentScope.as(BasicInfoComponent).getName()}`
      );
      return new EmptyComponent();
    }
    const allowed = foundSymbol.as(TypeComponent).allowsAssignmentOf(assignmentValue);
    if (!allowed) {
      this.addError(
        ctx,
        `Cannot assign ${assignmentValue.as(BasicInfoComponent).getName()} to ${foundSymbol.as(BasicInfoComponent).getName()}`
      )
    }
    return new EmptyComponent(); // Assignments don't return anything
  }

  visitMethod = (ctx: MethodContext) => {
    const methodName = ctx.IDENTIFIER().text;
    const methodExpectedType = ctx.TYPE();
    const methodBody = ctx.expression();


    const methodTable =
      methodExpectedType.text === "SELF_TYPE"
        ? this.getCurrentScope()
        : this.findTable(methodExpectedType);

    // ERROR: The method type is not yet defined (if ever)
    if (!methodTable) {
      this.addError(ctx, `Method type ${methodExpectedType.text} is not defined`);
      return this.next(ctx);
    }

    const methodType = methodTable.as(TypeComponent);
    if (!methodType) {
      this.addError(ctx, `Method type ${methodExpectedType.text} is not defined`);
      return this.next(ctx)
    }
    const { line, column } = this.lineAndColumn(ctx);

    const newMethod = new Method({
      name: methodName,
      type: methodType,
      column,
      line,
    })
    const currentTable: ClassType = this.getCurrentScope()!;
    const classTableComponent = currentTable.getComponent(TableComponent)!;

    const methodTableComponent = newMethod.getComponent(TableComponent)!;
    methodTableComponent.parent = classTableComponent;

    // If it doesn't exist, it is a syntax error
    const formalParameters = ctx.formal();
    this.scopeStack.push(newMethod);
    for (const param of formalParameters) {
      const newParam = this.visit(param);
      newMethod.addParameters(newParam);
    }


    const expressionResult: CompositionComponent = this.visit(methodBody);
    const expressionType = expressionResult.getComponent(TypeComponent);
    const expressionValue = expressionResult.getComponent(ValueHolderComponent);
    // ERROR: If the expression is not valid, an empty component is returned, and no type will be found
    if (!expressionType) {
      this.addError(ctx, `Expected expression to return '${methodExpectedType.text}' inside method '${methodName}'`);
      return this.next(ctx);
    }

    const canBeAssigned = methodType?.allowsAssignmentOf(expressionType);
    const isAncestor = methodType?.isAncestorOf(expressionType);

    // ERROR: Last child and return type do not match or can't be assigned
    if (!canBeAssigned && !isAncestor) {
      this.addError(
        ctx,
        `Cannot assign ${expressionType.name} to method of type ${methodType.name}`
      );
      return this.next(ctx);
    }

    if (expressionValue) {
      methodType.addComponent(new ValueHolderComponent({ value: expressionValue.value }));
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

    const previousClass: TypeComponent | undefined = this.findTable(dataType)?.as(TypeComponent);
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
    })

    if (assignmentExpression) {
      const resolvesTo: CompositionComponent = this.visit(assignmentExpression);
      const allowedAssigmentTo = previousClass.allowsAssignmentOf(resolvesTo);
      const isAncestor = previousClass.isAncestorOf(resolvesTo);
      // ERROR: Not allowed an assignment and the assignment is not to an ancestor
      if (!allowedAssigmentTo && !isAncestor) {
        this.addError(
          ctx,
          `Cannot assign ${resolvesTo?.componentName ?? "erroneous class"} to ${previousClass.componentName
          } (Can't assign type ${resolvesTo?.componentName ?? ""} to ${previousClass.componentName
          })`
        );
        return this.next(ctx);
      }
      if (resolvesTo.getComponent(ValueHolderComponent)) {
        newTableElement.addComponent(new ValueHolderComponent({ value: resolvesTo.getComponent(ValueHolderComponent)!.value }))
      }
    }

    const currentScope = this.getCurrentScope()!.as(ClassType)!;
    const currentScopeTable = currentScope.getComponent(TableComponent)!;


    const previousDeclared = currentScopeTable.get(name.text, {inCurrentScope: true});
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
