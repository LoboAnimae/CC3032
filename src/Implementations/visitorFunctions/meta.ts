import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { yaplVisitor } from '../../antlr/yaplVisitor';
import CompositionComponent from '../Components/Composition';
import TableComponent from '../Components/Table';
import TypeComponent from '../Components/Type';
import { Stack } from '../DataStructures/Stack';
import MethodElement from '../DataStructures/TableElements/MethodElement';
import { BasicStorage, IError } from '../Errors/Errors';
import { ClassType } from '../Generics/Object.type';
export const lineAndColumn = (ctx: any): { line: number; column: number } => ({
  line: ctx.start?.line ?? 0,
  column: ctx.start?.charPositionInLine ?? 0,
});

export enum Scope {
  Global = 1,
  General,
}

export interface ParseTreeProperties {
  scopeStack: Stack<CompositionComponent>;
  symbolsTable: TableComponent<TypeComponent>;
  mainExists: boolean;
  mainMethodExists: boolean;
  errors: BasicStorage<IError>;
}

export enum ScopePosition {
  Global,
  Class,
  Method,
}

export interface HelperFunctions {
  addError: (ctx: any, errorMessage: string) => void;
  findTable: (name: string | TypeComponent | any) => ClassType | null;
  returnToScope: (scope: Scope) => void;
  next: (ctx: any) => any;
  returnToGlobalScope: () => void;
  getCurrentScope: <T = ClassType | MethodElement>(offset?: ScopePosition) => T;
}

export type PossibleScope = ClassType | MethodElement;

export type YaplVisitor = AbstractParseTreeVisitor<any> & yaplVisitor<any> & HelperFunctions & ParseTreeProperties;
