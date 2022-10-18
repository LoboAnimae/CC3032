import { NegativeContext } from 'antlr/yaplParser';
import { extractBasicInformation, TypeComponent } from 'Components';
import { YaplVisitor } from '../visitor';

export function visitNegative(visitor: YaplVisitor, ctx: NegativeContext) {
  const expressionRaw = ctx.expression();
  const expressionType: TypeComponent = visitor.visit(expressionRaw);

  const basicInformationComponent = extractBasicInformation(expressionType);
  if (!basicInformationComponent) {
    throw new Error('Semantic bug: expression type does not have basic information');
  }
  // ERROR: Expression can't be negated
  if (!expressionType.allowsNegation) {
    visitor.addError(
      ctx,
      `Expression ${basicInformationComponent.getName()} of type ${expressionType.componentType} can't be negated`,
    );
  }
  return expressionType;
}
