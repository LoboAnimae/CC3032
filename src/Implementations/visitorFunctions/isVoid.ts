import { IsvoidContext } from '../../antlr/yaplParser';
import { TypeComponent } from '../Components/index';
import { ClassType, ObjectType } from '../Generics/Object.type';
import { YaplVisitor } from './meta';

export default function visitIsvoid(visitor: YaplVisitor, ctx: IsvoidContext) {
  const expressionRaw = ctx.expression();
  const expressionType: TypeComponent = visitor.visit(expressionRaw);

  // ERROR: Something that can't be instantiated can't be void
  if (![ClassType.Name, ObjectType.Name].includes(expressionType.componentName)) {
    visitor.addError(
      ctx,
      `Something of type ${expressionType.componentName} can't be void (Make sure it can be instantiated with 'new')`,
    );
  }
  return expressionType;
}
