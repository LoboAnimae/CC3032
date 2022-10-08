import { ClassDefineContext } from '../../antlr/yaplParser';
import { extractBasicInformation } from '../Components/BasicInformation';
import CompositionComponent from '../Components/Composition';
import TableComponent, { extractTableComponent } from '../Components/Table';
import { extractTypeComponent } from '../Components/Type';
import { SymbolElement, TableElementType } from '../DataStructures/TableElements/index';
import { ClassType, ObjectType } from '../Generics/Object.type';
import Pipeline from '../Pipeline';
import { YaplVisitor } from './meta';

/**
 * Checks that everything is alright in the class in itself
 * @param p_visitor
 * @param p_ctx
 * @returns The table
 */
function semantic(p_visitor: YaplVisitor, p_ctx: ClassDefineContext, p_errors: string[]): ClassType | void {
  p_visitor.returnToGlobalScope();
  let [cls, inheritsFrom = ObjectType.Name] = p_ctx.TYPE();

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
  }

  const newTable = parentTable.createChild();
  const basicComponent = extractBasicInformation(newTable)!;
  basicComponent.setName(cls.toString());

  return newTable;
}

function memory(visitor: YaplVisitor, p_table: TableComponent<TableElementType>) {
  let memoryOffset = 0;
  for (const element of p_table.getAll()) {
    if (element.componentName !== SymbolElement.Name) continue;
    const typeComponent = extractTypeComponent(element)!;
    element.setAddress(memoryOffset)
    memoryOffset += typeComponent.sizeInBytes!;
  }
}

export default function visitClassDefine(p_visitor: YaplVisitor, p_ctx: ClassDefineContext) {
  const errors: string[] = [];
  const newTable = semantic(p_visitor, p_ctx, errors);
  if (!newTable) {
    return p_visitor.next(p_ctx);
  }
  p_visitor.addError(p_ctx, ...errors);
  p_visitor.addSymbol(newTable);
  p_visitor.addScope(newTable);

  // Allow for the children to be put into memory
  const _children = p_visitor.visitChildren(p_ctx);

  const classTable: TableComponent<TableElementType> = extractTableComponent(newTable)!;
  memory(p_visitor, classTable);

  p_visitor.exitMainScope();

  return p_visitor.next(p_ctx);
}
