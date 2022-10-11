// Generated from yapl.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { MethodCallContext } from "./yaplParser";
import { OwnMethodCallContext } from "./yaplParser";
import { IfContext } from "./yaplParser";
import { WhileContext } from "./yaplParser";
import { BlockContext } from "./yaplParser";
import { LetInContext } from "./yaplParser";
import { NewContext } from "./yaplParser";
import { NegativeContext } from "./yaplParser";
import { IsvoidContext } from "./yaplParser";
import { MultiplyContext } from "./yaplParser";
import { DivisionContext } from "./yaplParser";
import { AddContext } from "./yaplParser";
import { MinusContext } from "./yaplParser";
import { LessThanContext } from "./yaplParser";
import { LessEqualContext } from "./yaplParser";
import { EqualContext } from "./yaplParser";
import { BoolNotContext } from "./yaplParser";
import { ParenthesesContext } from "./yaplParser";
import { IdContext } from "./yaplParser";
import { IntContext } from "./yaplParser";
import { StringContext } from "./yaplParser";
import { TrueContext } from "./yaplParser";
import { FalseContext } from "./yaplParser";
import { AssignmentContext } from "./yaplParser";
import { MethodContext } from "./yaplParser";
import { PropertyContext } from "./yaplParser";
import { ClassesContext } from "./yaplParser";
import { EofContext } from "./yaplParser";
import { ProgramContext } from "./yaplParser";
import { ProgramBlocksContext } from "./yaplParser";
import { ClassDefineContext } from "./yaplParser";
import { FeatureContext } from "./yaplParser";
import { FormalContext } from "./yaplParser";
import { AssignmentExprContext } from "./yaplParser";
import { ExpressionContext } from "./yaplParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `yaplParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface yaplVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `methodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethodCall?: (ctx: MethodCallContext) => Result;

	/**
	 * Visit a parse tree produced by the `ownMethodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOwnMethodCall?: (ctx: OwnMethodCallContext) => Result;

	/**
	 * Visit a parse tree produced by the `if`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIf?: (ctx: IfContext) => Result;

	/**
	 * Visit a parse tree produced by the `while`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhile?: (ctx: WhileContext) => Result;

	/**
	 * Visit a parse tree produced by the `block`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by the `letIn`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLetIn?: (ctx: LetInContext) => Result;

	/**
	 * Visit a parse tree produced by the `new`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNew?: (ctx: NewContext) => Result;

	/**
	 * Visit a parse tree produced by the `negative`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNegative?: (ctx: NegativeContext) => Result;

	/**
	 * Visit a parse tree produced by the `isvoid`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIsvoid?: (ctx: IsvoidContext) => Result;

	/**
	 * Visit a parse tree produced by the `multiply`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiply?: (ctx: MultiplyContext) => Result;

	/**
	 * Visit a parse tree produced by the `division`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDivision?: (ctx: DivisionContext) => Result;

	/**
	 * Visit a parse tree produced by the `add`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdd?: (ctx: AddContext) => Result;

	/**
	 * Visit a parse tree produced by the `minus`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMinus?: (ctx: MinusContext) => Result;

	/**
	 * Visit a parse tree produced by the `lessThan`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLessThan?: (ctx: LessThanContext) => Result;

	/**
	 * Visit a parse tree produced by the `lessEqual`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLessEqual?: (ctx: LessEqualContext) => Result;

	/**
	 * Visit a parse tree produced by the `equal`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqual?: (ctx: EqualContext) => Result;

	/**
	 * Visit a parse tree produced by the `boolNot`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBoolNot?: (ctx: BoolNotContext) => Result;

	/**
	 * Visit a parse tree produced by the `parentheses`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParentheses?: (ctx: ParenthesesContext) => Result;

	/**
	 * Visit a parse tree produced by the `id`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitId?: (ctx: IdContext) => Result;

	/**
	 * Visit a parse tree produced by the `int`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInt?: (ctx: IntContext) => Result;

	/**
	 * Visit a parse tree produced by the `string`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString?: (ctx: StringContext) => Result;

	/**
	 * Visit a parse tree produced by the `true`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrue?: (ctx: TrueContext) => Result;

	/**
	 * Visit a parse tree produced by the `false`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFalse?: (ctx: FalseContext) => Result;

	/**
	 * Visit a parse tree produced by the `assignment`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by the `method`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethod?: (ctx: MethodContext) => Result;

	/**
	 * Visit a parse tree produced by the `property`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProperty?: (ctx: PropertyContext) => Result;

	/**
	 * Visit a parse tree produced by the `classes`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClasses?: (ctx: ClassesContext) => Result;

	/**
	 * Visit a parse tree produced by the `eof`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEof?: (ctx: EofContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgramBlocks?: (ctx: ProgramBlocksContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.classDefine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassDefine?: (ctx: ClassDefineContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.feature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeature?: (ctx: FeatureContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.formal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormal?: (ctx: FormalContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.assignmentExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentExpr?: (ctx: AssignmentExprContext) => Result;

	/**
	 * Visit a parse tree produced by `yaplParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;
}

