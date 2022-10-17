import { NewContext } from 'antlr/yaplParser';
import {EmptyComponent} from 'Components';
import {MethodElement} from 'Implementations/DataStructures/TableElements';
import { ClassType } from 'Implementations/Generics';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';

export function visitNew(visitor: YaplVisitor, ctx: NewContext) {
  const instantiationOf = ctx.TYPE();

  const currentClass: ClassType | MethodElement = visitor.getCurrentScope();
  const currentClassBasicComponent = currentClass.getBasicInfo();

  const instantiatingClass = visitor.findTable(instantiationOf.text) as ClassType | null;
  const instantiatingType = instantiatingClass?.getType();
  const instantiatingBasicComponent = instantiatingClass?.getBasicInfo();

  if (!instantiatingType) {
    visitor.addError(ctx, `Cannot instantiate non-existing class ${instantiationOf.text}`);
    return new EmptyComponent();
  } else if (!instantiatingBasicComponent) {
    throw new Error('Bug! Instantiating class has no basic info component');
  } else if (currentClassBasicComponent?.getName() === instantiatingBasicComponent.getName()) {
    visitor.addError(ctx, `Attempting to instantiate ${currentClassBasicComponent?.getName()} inside itself`);
    return new EmptyComponent();
  }
  return instantiatingClass;
}
