import { IfContext } from 'antlr/yaplParser';
import { YaplVisitor } from 'Implementations/3_Semantic/visitor';
import { BoolType, ClassType } from 'Implementations/Generics';

export function visitIf(visitor: YaplVisitor, ctx: IfContext) {
  // Empty bodies are disallowed by the parser in itself
  const [condition, body, elses] = ctx.expression();
  const boolTable: ClassType = visitor.findTable(BoolType.Name)!;

  const conditionType = visitor.visit(condition);
  // ERROR: Condition can't be resolved to boolean
  if (!boolTable.allowsAssignmentOf(conditionType)) {
    visitor.addError(ctx, `Condition in if statement can't be resolved to boolean (got ${conditionType.tableName})`);
  }

  const thisIfType = visitor.visit(body);
  const elseBodiesType = visitor.visit(elses);
  // ERROR: If and else bodies don't have the same type
  const allowsAssignment = thisIfType.allowsAssignmentOf(elseBodiesType);
  if (!allowsAssignment) {
    visitor.addError(
      ctx,
      `If and else bodies don't have the same type (got ${thisIfType.tableName} and ${elseBodiesType.tableName})`,
    );
  }
  return thisIfType;
}
