import { NewContext } from '../../antlr/yaplParser';
import EmptyComponent from '../Components/EmptyComponent';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import { ClassType } from '../Generics/Object.type';
import { YaplVisitor } from './meta';

export default function visitNew(visitor: YaplVisitor, ctx: NewContext) {
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
