import { ClassDefineContext } from '../../antlr/yaplParser';
import { extractBasicInformation } from '../Components/BasicInformation';
import ComponentInformation from '../Components/ComponentInformation';
import { extractTypeComponent } from '../Components/Type';
import { ClassType } from '../Generics/Object.type';
import { YaplVisitor } from './meta';

export default function visitClassDefine(visitor: YaplVisitor, ctx: ClassDefineContext) {
  visitor.returnToGlobalScope();
  const { Object } = ComponentInformation.type;
  const [cls, inheritsFrom = Object.name] = ctx.TYPE();
  // ERROR: Class inherits from itself
  if (cls.toString() === inheritsFrom) {
    return visitor.next(ctx);
  }
  const classTable = visitor.findTable(cls);
  // ERROR: Class already exists
  if (classTable) {
    const typeComponent = extractTypeComponent(classTable)!;
    if (typeComponent.isGeneric) {
      visitor.addError(ctx, `Generic class ${cls} can't be redefined`);
    } else {
      visitor.addError(ctx, `Redefinition of class ${cls}`);
    }
    return visitor.next(ctx);
  }
  let parentTable: ClassType | null = visitor.findTable(inheritsFrom);
  const typeTableComponent = extractTypeComponent(parentTable);
  // ERROR: Trying to inherit from a non-existing class
  if (!parentTable) {
    visitor.addError(ctx, `Class ${cls} is trying to inherit from class ${inheritsFrom}, which does not exist`);
    parentTable = visitor.findTable(Object.name)!; // Shift back to Object as a failsafe
  }
  // ERROR: The table can't be inherited
  else if (!typeTableComponent) {
    visitor.addError(ctx, `Class ${cls} is trying to inherit from class ${inheritsFrom}, which is not a type`);
    return visitor.next(ctx);
  } else if (typeTableComponent.isGeneric) {
    visitor.addError(ctx, `Class ${cls} is trying to inherit from generic class ${inheritsFrom}`);
    return visitor.next(ctx);
  }
  const newTable = parentTable.createChild();

  const basicComponent = extractBasicInformation(newTable)!;
  basicComponent.setName(cls.toString());
  if (basicComponent.getName() === 'Main') {
    // ERROR: Main class is declared more than once
    if (visitor.mainExists) {
      visitor.addError(ctx, 'Main class is declared more than once');
      return visitor.next(ctx);
    }
    visitor.mainExists = true;
    // ERROR: Main class is trying to inherit from another class, which is not allowed
    if (parentTable?.componentName !== Object.name) {
      visitor.addError(ctx, `Main class can't inherit from ${inheritsFrom} (Main class can only inherit from Object)`);
    }
  }
  // Push the table to the stack and the table to the list of tables
  visitor.symbolsTable.add(newTable);
  visitor.scopeStack.push(newTable);
  return visitor.next(ctx);
}
