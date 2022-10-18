import { SymbolElement } from './SymbolElement';
import { MethodElement } from './MethodElement';

export * from './SymbolElement';
export * from './MethodElement';
export * from './TableElement';

export type TableElementType = SymbolElement | MethodElement;
