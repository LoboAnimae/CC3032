// Generated from yapl.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `yaplParser`.
 */
export interface yaplListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `methodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterMethodCall?: (ctx: MethodCallContext) => void;
	/**
	 * Exit a parse tree produced by the `methodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitMethodCall?: (ctx: MethodCallContext) => void;

	/**
	 * Enter a parse tree produced by the `ownMethodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterOwnMethodCall?: (ctx: OwnMethodCallContext) => void;
	/**
	 * Exit a parse tree produced by the `ownMethodCall`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitOwnMethodCall?: (ctx: OwnMethodCallContext) => void;

	/**
	 * Enter a parse tree produced by the `if`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterIf?: (ctx: IfContext) => void;
	/**
	 * Exit a parse tree produced by the `if`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitIf?: (ctx: IfContext) => void;

	/**
	 * Enter a parse tree produced by the `while`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterWhile?: (ctx: WhileContext) => void;
	/**
	 * Exit a parse tree produced by the `while`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitWhile?: (ctx: WhileContext) => void;

	/**
	 * Enter a parse tree produced by the `block`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by the `block`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by the `letIn`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterLetIn?: (ctx: LetInContext) => void;
	/**
	 * Exit a parse tree produced by the `letIn`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitLetIn?: (ctx: LetInContext) => void;

	/**
	 * Enter a parse tree produced by the `new`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNew?: (ctx: NewContext) => void;
	/**
	 * Exit a parse tree produced by the `new`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNew?: (ctx: NewContext) => void;

	/**
	 * Enter a parse tree produced by the `negative`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNegative?: (ctx: NegativeContext) => void;
	/**
	 * Exit a parse tree produced by the `negative`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNegative?: (ctx: NegativeContext) => void;

	/**
	 * Enter a parse tree produced by the `isvoid`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterIsvoid?: (ctx: IsvoidContext) => void;
	/**
	 * Exit a parse tree produced by the `isvoid`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitIsvoid?: (ctx: IsvoidContext) => void;

	/**
	 * Enter a parse tree produced by the `multiply`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterMultiply?: (ctx: MultiplyContext) => void;
	/**
	 * Exit a parse tree produced by the `multiply`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitMultiply?: (ctx: MultiplyContext) => void;

	/**
	 * Enter a parse tree produced by the `division`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterDivision?: (ctx: DivisionContext) => void;
	/**
	 * Exit a parse tree produced by the `division`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitDivision?: (ctx: DivisionContext) => void;

	/**
	 * Enter a parse tree produced by the `add`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAdd?: (ctx: AddContext) => void;
	/**
	 * Exit a parse tree produced by the `add`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAdd?: (ctx: AddContext) => void;

	/**
	 * Enter a parse tree produced by the `minus`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterMinus?: (ctx: MinusContext) => void;
	/**
	 * Exit a parse tree produced by the `minus`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitMinus?: (ctx: MinusContext) => void;

	/**
	 * Enter a parse tree produced by the `lessThan`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterLessThan?: (ctx: LessThanContext) => void;
	/**
	 * Exit a parse tree produced by the `lessThan`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitLessThan?: (ctx: LessThanContext) => void;

	/**
	 * Enter a parse tree produced by the `lessEqual`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterLessEqual?: (ctx: LessEqualContext) => void;
	/**
	 * Exit a parse tree produced by the `lessEqual`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitLessEqual?: (ctx: LessEqualContext) => void;

	/**
	 * Enter a parse tree produced by the `equal`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterEqual?: (ctx: EqualContext) => void;
	/**
	 * Exit a parse tree produced by the `equal`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitEqual?: (ctx: EqualContext) => void;

	/**
	 * Enter a parse tree produced by the `boolNot`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterBoolNot?: (ctx: BoolNotContext) => void;
	/**
	 * Exit a parse tree produced by the `boolNot`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitBoolNot?: (ctx: BoolNotContext) => void;

	/**
	 * Enter a parse tree produced by the `parentheses`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterParentheses?: (ctx: ParenthesesContext) => void;
	/**
	 * Exit a parse tree produced by the `parentheses`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitParentheses?: (ctx: ParenthesesContext) => void;

	/**
	 * Enter a parse tree produced by the `id`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterId?: (ctx: IdContext) => void;
	/**
	 * Exit a parse tree produced by the `id`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitId?: (ctx: IdContext) => void;

	/**
	 * Enter a parse tree produced by the `int`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterInt?: (ctx: IntContext) => void;
	/**
	 * Exit a parse tree produced by the `int`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitInt?: (ctx: IntContext) => void;

	/**
	 * Enter a parse tree produced by the `string`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterString?: (ctx: StringContext) => void;
	/**
	 * Exit a parse tree produced by the `string`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitString?: (ctx: StringContext) => void;

	/**
	 * Enter a parse tree produced by the `true`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterTrue?: (ctx: TrueContext) => void;
	/**
	 * Exit a parse tree produced by the `true`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitTrue?: (ctx: TrueContext) => void;

	/**
	 * Enter a parse tree produced by the `false`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterFalse?: (ctx: FalseContext) => void;
	/**
	 * Exit a parse tree produced by the `false`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitFalse?: (ctx: FalseContext) => void;

	/**
	 * Enter a parse tree produced by the `assignment`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by the `assignment`
	 * labeled alternative in `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by the `method`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	enterMethod?: (ctx: MethodContext) => void;
	/**
	 * Exit a parse tree produced by the `method`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	exitMethod?: (ctx: MethodContext) => void;

	/**
	 * Enter a parse tree produced by the `property`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	enterProperty?: (ctx: PropertyContext) => void;
	/**
	 * Exit a parse tree produced by the `property`
	 * labeled alternative in `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	exitProperty?: (ctx: PropertyContext) => void;

	/**
	 * Enter a parse tree produced by the `classes`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	enterClasses?: (ctx: ClassesContext) => void;
	/**
	 * Exit a parse tree produced by the `classes`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	exitClasses?: (ctx: ClassesContext) => void;

	/**
	 * Enter a parse tree produced by the `eof`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	enterEof?: (ctx: EofContext) => void;
	/**
	 * Exit a parse tree produced by the `eof`
	 * labeled alternative in `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	exitEof?: (ctx: EofContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	enterProgramBlocks?: (ctx: ProgramBlocksContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.programBlocks`.
	 * @param ctx the parse tree
	 */
	exitProgramBlocks?: (ctx: ProgramBlocksContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.classDefine`.
	 * @param ctx the parse tree
	 */
	enterClassDefine?: (ctx: ClassDefineContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.classDefine`.
	 * @param ctx the parse tree
	 */
	exitClassDefine?: (ctx: ClassDefineContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	enterFeature?: (ctx: FeatureContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.feature`.
	 * @param ctx the parse tree
	 */
	exitFeature?: (ctx: FeatureContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.formal`.
	 * @param ctx the parse tree
	 */
	enterFormal?: (ctx: FormalContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.formal`.
	 * @param ctx the parse tree
	 */
	exitFormal?: (ctx: FormalContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.assignmentExpr`.
	 * @param ctx the parse tree
	 */
	enterAssignmentExpr?: (ctx: AssignmentExprContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.assignmentExpr`.
	 * @param ctx the parse tree
	 */
	exitAssignmentExpr?: (ctx: AssignmentExprContext) => void;

	/**
	 * Enter a parse tree produced by `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `yaplParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;
}

