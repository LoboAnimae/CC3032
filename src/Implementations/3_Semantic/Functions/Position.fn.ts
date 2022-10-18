import { ClassType, MethodElement } from '../../';
import { CompositionComponent, TableComponent, TypeComponent } from '../../../Components';
import { Stack } from '../../DataStructures/Stack';

export function lineAndColumn(ctx: any): { line: number; column: number; } {
  const line: number = ctx.start.line;
  const column: number = ctx.start.charPositionInLine;

  return { line, column };
}

export enum Scope {
  Global = 1,
  General,
}

export interface ParseTreeProperties {
  scopeStack: Stack<CompositionComponent>;
  symbolsTable: TableComponent<TypeComponent>;
  mainExists: boolean;
  mainMethodExists: boolean;
}

export enum ScopePosition {
  Global,
  Class,
  Method,
}

export type PossibleScope = ClassType | MethodElement;
