import { WhileContext } from "../../antlr/yaplParser";
import { YaplVisitor } from "./meta";

export default function visitWhile(visitor: YaplVisitor, ctx: WhileContext) {
    const [booleanExpression, subResult] = ctx.expression();

    // There is no expression inside the while loop
    if (!booleanExpression) {
        return visitor.next(ctx);
    }
    const foundExpression = visitor.visit(booleanExpression);

    const boolTable = visitor.findTable("Bool")!;
    const allowsAssignment = boolTable.allowsAssignmentOf(foundExpression);
    // ERROR: The expression inside the while loop cannot be set as a boolean expression
    if (!allowsAssignment) {
        visitor.addError(
            ctx,
            `Expression inside while loop cannot be set as a boolean expression (got ${foundExpression.tableName})`
        );
        visitor.next(ctx);
    }
    return visitor.visit(subResult)!
}