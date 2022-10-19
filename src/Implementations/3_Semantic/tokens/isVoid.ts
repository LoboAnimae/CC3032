import { ClassType, ObjectType, Primitive } from '../../';
import { IsvoidContext } from '../../../antlr/yaplParser';
import { TypeComponent } from '../../../Components';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitIsvoid(visitor: YaplVisitor, ctx: IsvoidContext): Primitive[] {
  const expressionRaw = ctx.expression();
  const [expressionType] = visitor.visit(expressionRaw);

  // ERROR: Something that can't be instantiated can't be void
  if (![ClassType.Name, ObjectType.Name].includes(expressionType.componentName)) {
    visitor.addError(
      ctx,
      `Something of type ${Color.class(expressionType.componentName)} can't be void (Make sure it can be instantiated with ${Color.class('new')})`,
    );
  }
  return [expressionType];
}
