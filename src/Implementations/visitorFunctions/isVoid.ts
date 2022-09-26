import { IsvoidContext } from '../../antlr/yaplParser';
import ComponentInformation from '../Components/ComponentInformation';
import { TypeComponent } from '../Components/index';
import { YaplVisitor } from './meta';

export default function visitIsvoid(visitor: YaplVisitor, ctx: IsvoidContext) {
  const expressionRaw = ctx.expression();
  const expressionType: TypeComponent = visitor.visit(expressionRaw);

  const { Class } = ComponentInformation.components;
  const { Object } = ComponentInformation.type;
  // ERROR: Something that can't be instantiated can't be void
  if (![Class.name, Object.name].includes(expressionType.componentName)) {
    visitor.addError(
      ctx,
      `Something of type ${expressionType.componentName} can't be void (Make sure it can be instantiated with 'new')`,
    );
  }
  return expressionType;
}
