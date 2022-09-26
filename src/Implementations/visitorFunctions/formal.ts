import { FormalContext } from "../../antlr/yaplParser";
import CompositionComponent from "../Components/Composition";
import EmptyComponent from "../Components/EmptyComponent";
import SymbolElement from "../DataStructures/TableElements/SymbolElement";
import { lineAndColumn, YaplVisitor } from "./meta";

export default function visitFormal(visitor: YaplVisitor, ctx: FormalContext) {
    const paramName = ctx.IDENTIFIER();
    const dataType = ctx.TYPE();
    const foundTable: CompositionComponent | null | undefined = visitor.findTable(dataType)?.copy();

    // ERROR: The type is not yet defined
    if (!foundTable) {
      visitor.addError(ctx, `Type ${dataType.text} is not (yet?) defined`);
      return new EmptyComponent();
    }
    const newSymbol = new SymbolElement({
      name: paramName.text,
      type: foundTable,
      ...lineAndColumn(ctx),
    });
    return newSymbol;
}