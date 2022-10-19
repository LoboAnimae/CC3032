import { ErrorType, IntType, Primitive } from "../..";
import { AddContext, DivisionContext, MinusContext, MultiplyContext } from "../../../antlr/yaplParser";
import { extractTypeComponent, isEmptyComponent } from "../../../Components";
import { Color } from "../../../Misc";
import { YaplVisitor } from "../visitor";

function getOperator(ctx: AddContext | DivisionContext | MinusContext | MultiplyContext) {
    // @ts-ignore
    return ctx.ADD?.() ?? ctx.DIVISION?.() ?? ctx.MINUS?.() ?? ctx.MULTIPLY?.();
};

export function BinaryOperation(visitor: YaplVisitor, ctx: AddContext | DivisionContext | MultiplyContext | MinusContext): Primitive[] {
    // Must be done between two possible integers
    const [leftChild, rightChild] = ctx.expression();
    const intTable = visitor.findTable(IntType.Name)!.copy() as Primitive;

    const [leftElement] = visitor.visit(leftChild);
    const [rightElement] = visitor.visit(rightChild);

    const lExpr = extractTypeComponent(leftElement);
    const rExpr = extractTypeComponent(rightElement);

    if (!lExpr) {
        visitor.addError(ctx, `Expression ${Color.error(leftChild.text)} cannot be operated with arithmetic`);
    }
    if (!rExpr) {
        visitor.addError(ctx, `Expression ${Color.error(rightChild.text)} cannot be operated with arithmetic`);
    }

    const allowedComparison = lExpr?.allowsComparisonTo?.(rExpr ?? new ErrorType()) ?? false;

    // ERROR: If one of them is an ancestor of the other, they can be compared
    if (!allowedComparison) {
        if (isEmptyComponent(leftElement) || isEmptyComponent(rightElement)) {
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
    return [intTable];
}
