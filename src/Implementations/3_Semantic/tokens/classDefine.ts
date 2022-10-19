import { ClassDefineContext } from '../../../antlr/yaplParser';
import { extractBasicInformation, extractTypeComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { ClassType, ErrorType, ObjectType, Primitive } from '../../Generics';
import { YaplVisitor } from '../visitor';


export function visitClassDefine(visitor: YaplVisitor, ctx: ClassDefineContext): Primitive[] {
  visitor.returnToGlobalScope();
  let [cls, inheritsFrom = ObjectType.Name] = ctx.TYPE();
  if (cls.text === 'Main') {
    visitor.mainBranch = ctx;
  }

  // ERROR: Class inherits from itself
  if (cls.toString() === inheritsFrom.toString()) {
    const message = `${Color.class('Class')} ${Color.class(cls.text)} cannot inherit from itself (Attempting to inherit from ${Color.class(ObjectType.Name)} as a failsafe)`;
    visitor.addError(ctx, message);
    inheritsFrom = ObjectType.Name; // FAILSAFE: If something inherits from itself, make it inherit from ObjectType
  }

  const classTable = visitor.findTable(cls);
  // FATAL: Class already exists
  if (classTable) {
    const { isGeneric } = extractTypeComponent(classTable)!;
    if (isGeneric) {
      const message = `${Color.class('Class')} ${Color.class(cls.text)} is a ${Color.type('generic')} ${Color.class('class')} and ${Color.error('cannot')} be redefined`;
      visitor.addError(ctx, message);
    } else {
      const message = `${Color.class('Class')} ${Color.class(cls.text)} is already defined`; 
      visitor.addError(ctx, message);
    }
  }

  let parentTable = visitor.findTable(inheritsFrom) as ClassType;
  const typeTableComponent = extractTypeComponent(parentTable);
  // ERROR: Trying to inherit from a non-existing class
  if (!parentTable) {
    const message = `${Color.class('Class')} ${Color.class(inheritsFrom.toString())} is not defined but ${Color.class(cls.text)} is trying to inherit from it`;
    visitor.addError(ctx, message);
  }
  // ERROR: The table can't be inherited
  else if (!typeTableComponent) {
    const message = `${Color.class('Class')} ${Color.class(inheritsFrom.toString())} cannot be inherited from`;
    visitor.addError(ctx, message);
  } else if (typeTableComponent.isGeneric) {
    const message = `${Color.class('Class')} ${Color.class(inheritsFrom.toString())} is a ${Color.type('generic')} class and ${Color.error('cannot')} be inherited from, but ${Color.class(cls.text)} is trying to inherit from it`;
    visitor.addError(ctx, message);
  } 


  const inMainClass = cls.toString() === 'Main';
  if (inMainClass) {
    visitor.enterMainScope();
    visitor.mainExists = true;
    // ERROR: Main class is trying to inherit from another class, which is not allowed
    if (parentTable?.componentName !== ObjectType.Name) {
      const message = `${Color.class('Class')} ${Color.class(cls.text)} ${Color.error('cannot')} inherit from another ${Color.class('class')} other than ${Color.class(ObjectType.Name)}`;
      visitor.addError(ctx, message);
      parentTable = visitor.findTable(ObjectType.Name)!;
    }
    visitor.mainBranch = ctx;
  }

  const newTable = parentTable.createChild(ctx);
  newTable.componentName = cls.toString();
  const basicComponent = extractBasicInformation(newTable)!;
  basicComponent.setName(cls.toString());

  if (!newTable) {
    return visitor.next(ctx);
  }
  visitor.addSymbol(newTable);
  visitor.addScope(newTable);

  return visitor.next(ctx);
}
