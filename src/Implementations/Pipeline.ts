import { ExpressionContext } from "../antlr/yaplParser";
import { YaplVisitor } from "../Implementations/visitorFunctions/meta";
import CompositionComponent from "./Components/Composition";

export type visitorCTX<T extends ExpressionContext> = (visitor: YaplVisitor, ctx: T, saveIn?: CompositionComponent) => boolean | void;

export interface VisitorParams<T extends ExpressionContext> {
    visitor: YaplVisitor;
    ctx: T;
    saveIn?: CompositionComponent;
}

export default function Pipeline<T extends ExpressionContext>({visitor, ctx, saveIn}: VisitorParams<T>, ...functions: visitorCTX<T>[]): boolean {
    for (const fn of functions) {
        const successful = fn(visitor, ctx, saveIn);
        if (!successful) console.log('Function was not successful')
    }
    return true;
}