import { BoolType, ErrorType, Primitive } from "../..";
import { EqualContext, LessEqualContext, LessThanContext } from "../../../antlr/yaplParser";
import { extractTypeComponent, isEmptyComponent } from "../../../Components";
import { Color } from "../../../Misc";
import { YaplVisitor } from "../visitor";

function getOperator(ctx: EqualContext | LessEqualContext | LessThanContext) {
    // @ts-ignore
    return ctx.EQUAL?.() ?? ctx.LESS_EQUAL?.() ?? ctx.LESS_THAN?.();
}

export function ComparisonFunction(visitor: YaplVisitor, ctx: EqualContext | LessEqualContext | LessThanContext): Primitive[] {
    const [leftChild, rightChild] = ctx.expression();
    const boolTable = visitor.findTable(BoolType.Name)!.copy() as Primitive;

    const [leftChildResult] = visitor.visit(leftChild);
    const [rightChildResult] = visitor.visit(rightChild);

    const lExpr = extractTypeComponent(leftChildResult);
    const rExpr = extractTypeComponent(rightChildResult);

    if (!lExpr) {
        visitor.addError(ctx, `Expression ${leftChild.text} cannot be operated with arithmetic`);
    }
    if (!rExpr) {
        visitor.addError(ctx, `Expression ${rightChild.text} cannot be operated with arithmetic`);
    }

    const allowedComparison = lExpr?.allowsComparisonTo?.(rExpr ?? new ErrorType()) ?? false;

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
        if (isEmptyComponent(leftChildResult) || isEmptyComponent(rightChildResult)) {
            visitor.addError(ctx, `One of the expressions returned an ${Color.error('error')}, which cannot be operated with arithmetic`);
        } else {
            const leftName = Color.raw(leftChild.text ?? leftChild.toString());
            const leftType = Color.class(lExpr!.componentName);
            const rightName = Color.raw(rightChild.text ?? rightChild.toString());
            const rightType = Color.class(rExpr!.componentName);
            const operator = Color.error(getOperator(ctx));
            const message = `Operator ${operator} cannot operate operands ${leftName} (${leftType}) and ${rightName} (${rightType})`;
            visitor.addError(ctx, message);
        }
    }
    return [boolTable];
}