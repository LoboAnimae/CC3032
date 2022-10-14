import { IdContext } from "../../../antlr/yaplParser";
import { IMemoryVisitor, MemoryVisitor } from "../Memory";
import SymbolElement from "../TableElements/SymbolElement";
import { LoadWord, Move } from "./Instructions/MemoryManagement";
import { STACK_POINTER, TemporalValue } from "./TemporaryValues";

export default function (visitor: MemoryVisitor, ctx: IdContext): IMemoryVisitor[] {
    const name = ctx.IDENTIFIER();
    const currentTable = visitor.currentClassTable();
    const found = currentTable.get(name.text)! as SymbolElement;
    const inTable = currentTable.getAll();
    const allElements = currentTable.getAll(false).filter(element => element.componentName === SymbolElement.Name && !inTable.includes(element));
    const thisTemporal = new TemporalValue();
    const foundTemporal = inTable.find((el) => (el as SymbolElement).getName() === name.text) as SymbolElement;
const size = found.getSize();
    if (foundTemporal) {
        visitor.addQuadruple(new LoadWord({
            dataMovesInto: thisTemporal,
            dataMovesFrom: foundTemporal.getName(),
            comment: `Load value from stack`
        }));
        // If it is in the table, use it's temporal
    } else if (found) {
        const currentClass = visitor.currentClass(-1);
        const elementNames = allElements.map((el: any) => (el as SymbolElement).getName());
        const elementSizes = allElements.map((el: any) => el.getSize());
        const currentElementIndex = elementNames.indexOf(found.getName());
        // Find the offset
        const offset = elementSizes.slice(0, currentElementIndex).reduce((a, b) => a + b, 0);
        visitor.addQuadruple(new Move(
            {
                dataMovesInto: thisTemporal,
                dataMovesFrom: new STACK_POINTER(),
                offset: offset,
                comment: `Load value from the immediate memory`
            }));
    }
    const returnValue: IMemoryVisitor = {
        getTemporal: () => thisTemporal,
        size,
    };
    return [returnValue];
}