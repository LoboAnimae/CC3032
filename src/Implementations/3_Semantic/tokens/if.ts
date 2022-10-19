import { BoolType, ClassType, Primitive } from '../../';
import { IfContext } from '../../../antlr/yaplParser';
import { Color } from '../../../Misc';
import { YaplVisitor } from '../visitor';

export function visitIf(visitor: YaplVisitor, ctx: IfContext): Primitive[] {
  // Empty bodies are disallowed by the parser in itself
  const [condition, body, elses] = ctx.expression();
  const boolTable: ClassType = visitor.findTable(BoolType.Name)!;

  const [conditionType] = visitor.visit(condition);
  // ERROR: Condition can't be resolved to boolean
  if (!boolTable.allowsAssignmentOf(conditionType)) {
    visitor.addError(ctx, `Condition in if statement can't be resolved to boolean (got ${conditionType.componentName})`);
  }

  const [thisIfType] = visitor.visit(body);
  const [elseBodiesType] = visitor.visit(elses);
  // ERROR: If and else bodies don't have the same type
  const allowsAssignment = thisIfType.allowsAssignmentOf(elseBodiesType);
  if (!allowsAssignment) {
    const message = `${Color.info('If')} and ${Color.info('else')} bodies ${Color.error('don\'t have the same type')} (got ${Color.class(thisIfType.componentName)} and ${Color.class(elseBodiesType.componentName)})`;
    visitor.addError(ctx, message);
  }
  return [thisIfType];
}
