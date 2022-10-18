import { IsvoidContext } from 'antlr/yaplParser';
import { TypeComponent } from 'Components';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { ClassType, ObjectType } from 'Implementations/Generics';

export function visitIsvoid(visitor: YaplVisitor, ctx: IsvoidContext) {
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
