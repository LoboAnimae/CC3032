import { ClassType, ErrorType, MethodElement, Primitive } from '../../';
import { NewContext } from '../../../antlr/yaplParser';
import { CompositionComponent, EmptyComponent, extractTypeComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitNew(visitor: YaplVisitor, ctx: NewContext): Primitive[] {
  const instantiationOf = ctx.TYPE();

  const currentClass: ClassType | MethodElement = visitor.getCurrentScope();
  const currentClassBasicComponent = currentClass.getBasicInfo();

  const instantiatingClass = visitor.findTable(instantiationOf.text) as ClassType | null;
  const instantiatingType = extractTypeComponent(instantiatingClass);
  const instantiatingBasicComponent = instantiatingClass?.getBasicInfo();

  if (!instantiatingType) {
    const message = `Cannot instantiate non-existing ${Color.class('class')} ${Color.class(instantiationOf.text)}`;
    visitor.addError(ctx, message);
    return [new ErrorType()];
  } else if (!instantiatingBasicComponent) {
    throw new Error('Bug! Instantiating class has no basic info component');
  } else if (currentClassBasicComponent?.getName() === instantiatingBasicComponent.getName()) {
    const message = `Cannot instantiate ${Color.class('class')} ${Color.class(currentClassBasicComponent?.getName()!)} inside itself`;
    visitor.addError(ctx, message);
    return [new ErrorType()];
  }
  return [instantiatingType! as Primitive];
}
