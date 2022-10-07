import { ClassDefineContext } from '../../antlr/yaplParser';
import { extractBasicInformation } from '../Components/BasicInformation';
import ComponentInformation from '../Components/ComponentInformation';
import CompositionComponent from '../Components/Composition';
import TableComponent, { extractTableComponent } from '../Components/Table';
import { extractTypeComponent } from '../Components/Type';
import { TableElementType } from '../DataStructures/TableElements/index';
import { ClassType } from '../Generics/Object.type';
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
  const { Object } = ComponentInformation.type;
  let [cls, inheritsFrom = Object.name] = p_ctx.TYPE();

  // ERROR: Class inherits from itself
  if (cls.toString() === inheritsFrom.toString()) {
    p_errors.push(`Class ${cls.toString()} can't inherit from itself`);
    inheritsFrom = Object.name; // FAILSAFE: If something inherits from itself, make it inherit from Object
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
    parentTable = p_visitor.findTable(Object.name)!; // Shift back to Object as a failsafe instead of failing
  }

  const inMainClass = cls.toString() === 'Main';
  if (inMainClass) {
    p_visitor.mainExists = true;
    // ERROR: Main class is trying to inherit from another class, which is not allowed
    if (parentTable?.componentName !== Object.name) {
      p_errors.push(`Main class can't inherit from any class`);
      parentTable = p_visitor.findTable(Object.name)!;
    }
  }

  const newTable = parentTable.createChild();
  const basicComponent = extractBasicInformation(newTable)!;
  basicComponent.setName(cls.toString());

  return newTable;
}

function memory(p_classSize: number, p_table: TableComponent<TableElementType>) {
  let offset = 0;
  for (const element of p_table.getAll()) {
    const typeComponent = extractTypeComponent(element)!;
    offset += typeComponent.sizeInBytes ?? 0;
    console.log(element);
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
  const classSize: number = classTable.size;
  memory(classSize, classTable);

  return p_visitor.next(p_ctx);
}
