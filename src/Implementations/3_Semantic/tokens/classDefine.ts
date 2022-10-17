import { ClassDefineContext } from 'antlr/yaplParser';
import { extractBasicInformation, extractTypeComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { ClassType, ObjectType } from 'Implementations/Generics';

/**
 * Checks that everything is alright in the class in itself
 * @param p_visitor
 * @param p_ctx
 * @returns The table
 */
function semantic(p_visitor: YaplVisitor, p_ctx: ClassDefineContext, p_errors: string[]): ClassType | void {
  let [cls, inheritsFrom = ObjectType.Name] = p_ctx.TYPE();
  if (cls.text === 'Main') {
    p_visitor.mainBranch = p_ctx;
  }

  // ERROR: Class inherits from itself
  if (cls.toString() === inheritsFrom.toString()) {
    p_errors.push(`Class ${cls.toString()} can't inherit from itself`);
    inheritsFrom = ObjectType.Name; // FAILSAFE: If something inherits from itself, make it inherit from ObjectType
  }

  const classTable = p_visitor.findTable(cls);
  // FATAL: Class already exists
  if (classTable) {
    const { isGeneric } = extractTypeComponent(classTable)!;
    if (isGeneric) {
      p_errors.push(`Generic class ${cls} can't be redefined`);
      return;
    }
    p_errors.push(`Redefinition of class ${cls}`);
    return;
  }

  let parentTable = p_visitor.findTable(inheritsFrom) as ClassType;
  const typeTableComponent = extractTypeComponent(parentTable);
  let defaultInheritance = true;
  // ERROR: Trying to inherit from a non-existing class
  if (!parentTable) {
    p_errors.push(`Class ${cls} inherits from non-existing class ${inheritsFrom}`);
  }
  // ERROR: The table can't be inherited
  else if (!typeTableComponent) {
    p_errors.push(`Class ${cls} is trying to inherit from class ${inheritsFrom}, which is not a type`);
  } else if (typeTableComponent.isGeneric) {
    p_errors.push(`Class ${cls} is trying to inherit from generic class ${inheritsFrom}`);
  } else {
    defaultInheritance = false;
  }

  if (defaultInheritance) {
    parentTable = p_visitor.findTable(ObjectType.Name)!; // Shift back to ObjectType as a failsafe instead of failing
  }

  const inMainClass = cls.toString() === 'Main';
  if (inMainClass) {
    p_visitor.enterMainScope();
    p_visitor.mainExists = true;
    // ERROR: Main class is trying to inherit from another class, which is not allowed
    if (parentTable?.componentName !== ObjectType.Name) {
      p_errors.push(`Main class can't inherit from any class`);
      parentTable = p_visitor.findTable(ObjectType.Name)!;
    }
    p_visitor.mainBranch = p_ctx;
  }

  const newTable = parentTable.createChild(p_ctx);
  newTable.componentName = cls.toString();
  const basicComponent = extractBasicInformation(newTable)!;
  basicComponent.setName(cls.toString());

  return newTable;
}

export default function visitClassDefine(p_visitor: YaplVisitor, p_ctx: ClassDefineContext) {
  p_visitor.returnToGlobalScope();
  const errors: string[] = [];
  const newTable = semantic(p_visitor, p_ctx, errors);
  if (!newTable) {
    return p_visitor.next(p_ctx);
  }
  p_visitor.addError(p_ctx, ...errors);
  p_visitor.addSymbol(newTable);
  p_visitor.addScope(newTable);

  return p_visitor.next(p_ctx);
}
