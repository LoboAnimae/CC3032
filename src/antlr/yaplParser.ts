// Generated from yapl.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { yaplListener } from "./yaplListener";
import { yaplVisitor } from "./yaplVisitor";


export class yaplParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly CLASS = 10;
	public static readonly ELSE = 11;
	public static readonly FALSE = 12;
	public static readonly FI = 13;
	public static readonly IF = 14;
	public static readonly IN = 15;
	public static readonly INHERITS = 16;
	public static readonly ISVOID = 17;
	public static readonly LET = 18;
	public static readonly LOOP = 19;
	public static readonly POOL = 20;
	public static readonly THEN = 21;
	public static readonly WHILE = 22;
	public static readonly CASE = 23;
	public static readonly ESAC = 24;
	public static readonly NEW = 25;
	public static readonly OF = 26;
	public static readonly TRUE = 27;
	public static readonly STRING = 28;
	public static readonly INT = 29;
	public static readonly TYPE = 30;
	public static readonly IDENTIFIER = 31;
	public static readonly ASSIGNMENT = 32;
	public static readonly CASE_ARROW = 33;
	public static readonly ADD = 34;
	public static readonly MINUS = 35;
	public static readonly MULTIPLY = 36;
	public static readonly DIVISION = 37;
	public static readonly LESS_THAN = 38;
	public static readonly LESS_EQUAL = 39;
	public static readonly EQUAL = 40;
	public static readonly INTEGER_NEGATIVE = 41;
	public static readonly OPEN_COMMENT = 42;
	public static readonly CLOSE_COMMENT = 43;
	public static readonly COMMENT = 44;
	public static readonly ONE_LINE_COMMENT = 45;
	public static readonly WHITESPACE = 46;
	public static readonly RULE_program = 0;
	public static readonly RULE_programBlocks = 1;
	public static readonly RULE_classDefine = 2;
	public static readonly RULE_feature = 3;
	public static readonly RULE_formal = 4;
	public static readonly RULE_assignmentExpr = 5;
	public static readonly RULE_expression = 6;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "programBlocks", "classDefine", "feature", "formal", "assignmentExpr", 
		"expression",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "';'", "'{'", "'}'", "'('", "','", "')'", "':'", "'@'", "'.'", 
		undefined, undefined, "'false'", undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, "'true'", undefined, undefined, undefined, 
		undefined, "'<-'", "'=>'", "'+'", "'-'", "'*'", "'/'", "'<'", "'<='", 
		"'='", "'~'", "'(*'", "'*)'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, "CLASS", "ELSE", "FALSE", "FI", "IF", 
		"IN", "INHERITS", "ISVOID", "LET", "LOOP", "POOL", "THEN", "WHILE", "CASE", 
		"ESAC", "NEW", "OF", "TRUE", "STRING", "INT", "TYPE", "IDENTIFIER", "ASSIGNMENT", 
		"CASE_ARROW", "ADD", "MINUS", "MULTIPLY", "DIVISION", "LESS_THAN", "LESS_EQUAL", 
		"EQUAL", "INTEGER_NEGATIVE", "OPEN_COMMENT", "CLOSE_COMMENT", "COMMENT", 
		"ONE_LINE_COMMENT", "WHITESPACE",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(yaplParser._LITERAL_NAMES, yaplParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return yaplParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "yapl.g4"; }

	// @Override
	public get ruleNames(): string[] { return yaplParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return yaplParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(yaplParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, yaplParser.RULE_program);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 14;
			this.programBlocks();
			this.state = 15;
			this.match(yaplParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public programBlocks(): ProgramBlocksContext {
		let _localctx: ProgramBlocksContext = new ProgramBlocksContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, yaplParser.RULE_programBlocks);
		try {
			this.state = 22;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case yaplParser.CLASS:
				_localctx = new ClassesContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 17;
				this.classDefine();
				this.state = 18;
				this.match(yaplParser.T__0);
				this.state = 19;
				this.programBlocks();
				}
				break;
			case yaplParser.EOF:
				_localctx = new EofContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 21;
				this.match(yaplParser.EOF);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classDefine(): ClassDefineContext {
		let _localctx: ClassDefineContext = new ClassDefineContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, yaplParser.RULE_classDefine);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 24;
			this.match(yaplParser.CLASS);
			this.state = 25;
			this.match(yaplParser.TYPE);
			this.state = 28;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === yaplParser.INHERITS) {
				{
				this.state = 26;
				this.match(yaplParser.INHERITS);
				this.state = 27;
				this.match(yaplParser.TYPE);
				}
			}

			this.state = 30;
			this.match(yaplParser.T__1);
			this.state = 36;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === yaplParser.IDENTIFIER) {
				{
				{
				this.state = 31;
				this.feature();
				this.state = 32;
				this.match(yaplParser.T__0);
				}
				}
				this.state = 38;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 39;
			this.match(yaplParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public feature(): FeatureContext {
		let _localctx: FeatureContext = new FeatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, yaplParser.RULE_feature);
		let _la: number;
		try {
			this.state = 67;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				_localctx = new MethodContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 41;
				this.match(yaplParser.IDENTIFIER);
				this.state = 42;
				this.match(yaplParser.T__3);
				this.state = 51;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === yaplParser.IDENTIFIER) {
					{
					this.state = 43;
					this.formal();
					this.state = 48;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la === yaplParser.T__4) {
						{
						{
						this.state = 44;
						this.match(yaplParser.T__4);
						this.state = 45;
						this.formal();
						}
						}
						this.state = 50;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 53;
				this.match(yaplParser.T__5);
				this.state = 54;
				this.match(yaplParser.T__6);
				this.state = 55;
				this.match(yaplParser.TYPE);
				this.state = 56;
				this.match(yaplParser.T__1);
				this.state = 57;
				this.expression(0);
				this.state = 58;
				this.match(yaplParser.T__2);
				}
				break;

			case 2:
				_localctx = new PropertyContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 60;
				this.match(yaplParser.IDENTIFIER);
				this.state = 61;
				this.match(yaplParser.T__6);
				this.state = 62;
				this.match(yaplParser.TYPE);
				this.state = 65;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === yaplParser.ASSIGNMENT) {
					{
					this.state = 63;
					this.match(yaplParser.ASSIGNMENT);
					this.state = 64;
					this.expression(0);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formal(): FormalContext {
		let _localctx: FormalContext = new FormalContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, yaplParser.RULE_formal);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 69;
			this.match(yaplParser.IDENTIFIER);
			this.state = 70;
			this.match(yaplParser.T__6);
			this.state = 71;
			this.match(yaplParser.TYPE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentExpr(): AssignmentExprContext {
		let _localctx: AssignmentExprContext = new AssignmentExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, yaplParser.RULE_assignmentExpr);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 73;
			this.match(yaplParser.IDENTIFIER);
			this.state = 74;
			this.match(yaplParser.T__6);
			this.state = 75;
			this.match(yaplParser.TYPE);
			this.state = 78;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === yaplParser.ASSIGNMENT) {
				{
				this.state = 76;
				this.match(yaplParser.ASSIGNMENT);
				this.state = 77;
				this.expression(0);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 12;
		this.enterRecursionRule(_localctx, 12, yaplParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 150;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				_localctx = new OwnMethodCallContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 81;
				this.match(yaplParser.IDENTIFIER);
				this.state = 82;
				this.match(yaplParser.T__3);
				this.state = 91;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << yaplParser.T__1) | (1 << yaplParser.T__3) | (1 << yaplParser.FALSE) | (1 << yaplParser.IF) | (1 << yaplParser.ISVOID) | (1 << yaplParser.LET) | (1 << yaplParser.WHILE) | (1 << yaplParser.NEW) | (1 << yaplParser.TRUE) | (1 << yaplParser.STRING) | (1 << yaplParser.INT) | (1 << yaplParser.IDENTIFIER))) !== 0) || _la === yaplParser.INTEGER_NEGATIVE) {
					{
					this.state = 83;
					this.expression(0);
					this.state = 88;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la === yaplParser.T__4) {
						{
						{
						this.state = 84;
						this.match(yaplParser.T__4);
						this.state = 85;
						this.expression(0);
						}
						}
						this.state = 90;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 93;
				this.match(yaplParser.T__5);
				}
				break;

			case 2:
				{
				_localctx = new IfContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 94;
				this.match(yaplParser.IF);
				this.state = 95;
				this.expression(0);
				this.state = 96;
				this.match(yaplParser.THEN);
				this.state = 97;
				this.expression(0);
				this.state = 98;
				this.match(yaplParser.ELSE);
				this.state = 99;
				this.expression(0);
				this.state = 100;
				this.match(yaplParser.FI);
				}
				break;

			case 3:
				{
				_localctx = new WhileContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 102;
				this.match(yaplParser.WHILE);
				this.state = 103;
				this.expression(0);
				this.state = 104;
				this.match(yaplParser.LOOP);
				this.state = 105;
				this.expression(0);
				this.state = 106;
				this.match(yaplParser.POOL);
				}
				break;

			case 4:
				{
				_localctx = new BlockContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 108;
				this.match(yaplParser.T__1);
				this.state = 112;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 109;
					this.expression(0);
					this.state = 110;
					this.match(yaplParser.T__0);
					}
					}
					this.state = 114;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << yaplParser.T__1) | (1 << yaplParser.T__3) | (1 << yaplParser.FALSE) | (1 << yaplParser.IF) | (1 << yaplParser.ISVOID) | (1 << yaplParser.LET) | (1 << yaplParser.WHILE) | (1 << yaplParser.NEW) | (1 << yaplParser.TRUE) | (1 << yaplParser.STRING) | (1 << yaplParser.INT) | (1 << yaplParser.IDENTIFIER))) !== 0) || _la === yaplParser.INTEGER_NEGATIVE);
				this.state = 116;
				this.match(yaplParser.T__2);
				}
				break;

			case 5:
				{
				_localctx = new LetInContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 118;
				this.match(yaplParser.LET);
				this.state = 119;
				this.assignmentExpr();
				this.state = 124;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === yaplParser.T__4) {
					{
					{
					this.state = 120;
					this.match(yaplParser.T__4);
					this.state = 121;
					this.assignmentExpr();
					}
					}
					this.state = 126;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 127;
				this.match(yaplParser.IN);
				this.state = 128;
				this.expression(19);
				}
				break;

			case 6:
				{
				_localctx = new NewContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 130;
				this.match(yaplParser.NEW);
				this.state = 131;
				this.match(yaplParser.TYPE);
				}
				break;

			case 7:
				{
				_localctx = new NegativeContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 132;
				this.match(yaplParser.INTEGER_NEGATIVE);
				this.state = 133;
				this.expression(17);
				}
				break;

			case 8:
				{
				_localctx = new IsvoidContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 134;
				this.match(yaplParser.ISVOID);
				this.state = 135;
				this.expression(16);
				}
				break;

			case 9:
				{
				_localctx = new BoolNotContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 136;
				this.match(yaplParser.INTEGER_NEGATIVE);
				this.state = 137;
				this.expression(8);
				}
				break;

			case 10:
				{
				_localctx = new ParenthesesContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 138;
				this.match(yaplParser.T__3);
				this.state = 139;
				this.expression(0);
				this.state = 140;
				this.match(yaplParser.T__5);
				}
				break;

			case 11:
				{
				_localctx = new IdContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 142;
				this.match(yaplParser.IDENTIFIER);
				}
				break;

			case 12:
				{
				_localctx = new IntContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 143;
				this.match(yaplParser.INT);
				}
				break;

			case 13:
				{
				_localctx = new StringContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 144;
				this.match(yaplParser.STRING);
				}
				break;

			case 14:
				{
				_localctx = new TrueContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 145;
				this.match(yaplParser.TRUE);
				}
				break;

			case 15:
				{
				_localctx = new FalseContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 146;
				this.match(yaplParser.FALSE);
				}
				break;

			case 16:
				{
				_localctx = new AssignmentContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 147;
				this.match(yaplParser.IDENTIFIER);
				this.state = 148;
				this.match(yaplParser.ASSIGNMENT);
				this.state = 149;
				this.expression(1);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 194;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 17, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 192;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplyContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 152;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 153;
						this.match(yaplParser.MULTIPLY);
						this.state = 154;
						this.expression(16);
						}
						break;

					case 2:
						{
						_localctx = new DivisionContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 155;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 156;
						this.match(yaplParser.DIVISION);
						this.state = 157;
						this.expression(15);
						}
						break;

					case 3:
						{
						_localctx = new AddContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 158;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 159;
						this.match(yaplParser.ADD);
						this.state = 160;
						this.expression(14);
						}
						break;

					case 4:
						{
						_localctx = new MinusContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 161;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 162;
						this.match(yaplParser.MINUS);
						this.state = 163;
						this.expression(13);
						}
						break;

					case 5:
						{
						_localctx = new LessThanContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 164;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 165;
						this.match(yaplParser.LESS_THAN);
						this.state = 166;
						this.expression(12);
						}
						break;

					case 6:
						{
						_localctx = new LessEqualContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 167;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 168;
						this.match(yaplParser.LESS_EQUAL);
						this.state = 169;
						this.expression(11);
						}
						break;

					case 7:
						{
						_localctx = new EqualContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 170;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 171;
						this.match(yaplParser.EQUAL);
						this.state = 172;
						this.expression(10);
						}
						break;

					case 8:
						{
						_localctx = new MethodCallContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, yaplParser.RULE_expression);
						this.state = 173;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 176;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === yaplParser.T__7) {
							{
							this.state = 174;
							this.match(yaplParser.T__7);
							this.state = 175;
							this.match(yaplParser.TYPE);
							}
						}

						this.state = 178;
						this.match(yaplParser.T__8);
						this.state = 179;
						this.match(yaplParser.IDENTIFIER);
						this.state = 180;
						this.match(yaplParser.T__3);
						this.state = 189;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << yaplParser.T__1) | (1 << yaplParser.T__3) | (1 << yaplParser.FALSE) | (1 << yaplParser.IF) | (1 << yaplParser.ISVOID) | (1 << yaplParser.LET) | (1 << yaplParser.WHILE) | (1 << yaplParser.NEW) | (1 << yaplParser.TRUE) | (1 << yaplParser.STRING) | (1 << yaplParser.INT) | (1 << yaplParser.IDENTIFIER))) !== 0) || _la === yaplParser.INTEGER_NEGATIVE) {
							{
							this.state = 181;
							this.expression(0);
							this.state = 186;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							while (_la === yaplParser.T__4) {
								{
								{
								this.state = 182;
								this.match(yaplParser.T__4);
								this.state = 183;
								this.expression(0);
								}
								}
								this.state = 188;
								this._errHandler.sync(this);
								_la = this._input.LA(1);
							}
							}
						}

						this.state = 191;
						this.match(yaplParser.T__5);
						}
						break;
					}
					}
				}
				this.state = 196;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 17, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 6:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 15);

		case 1:
			return this.precpred(this._ctx, 14);

		case 2:
			return this.precpred(this._ctx, 13);

		case 3:
			return this.precpred(this._ctx, 12);

		case 4:
			return this.precpred(this._ctx, 11);

		case 5:
			return this.precpred(this._ctx, 10);

		case 6:
			return this.precpred(this._ctx, 9);

		case 7:
			return this.precpred(this._ctx, 24);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x030\xC8\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x05\x03\x19\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\x1F" +
		"\n\x04\x03\x04\x03\x04\x03\x04\x03\x04\x07\x04%\n\x04\f\x04\x0E\x04(\v" +
		"\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x07\x051" +
		"\n\x05\f\x05\x0E\x054\v\x05\x05\x056\n\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05" +
		"\x05D\n\x05\x05\x05F\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x05\x07Q\n\x07\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x07\bY\n\b\f\b\x0E\b\\\v\b\x05\b^\n\b\x03\b\x03\b\x03\b\x03\b" +
		"\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x06\bs\n\b\r\b\x0E\bt\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x07\b}\n\b\f\b\x0E\b\x80\v\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\x99\n\b\x03\b\x03\b\x03\b\x03\b" +
		"\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xB3\n\b\x03\b" +
		"\x03\b\x03\b\x03\b\x03\b\x03\b\x07\b\xBB\n\b\f\b\x0E\b\xBE\v\b\x05\b\xC0" +
		"\n\b\x03\b\x07\b\xC3\n\b\f\b\x0E\b\xC6\v\b\x03\b\x02\x02\x03\x0E\t\x02" +
		"\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x02\x02\x02\xE6\x02\x10" +
		"\x03\x02\x02\x02\x04\x18\x03\x02\x02\x02\x06\x1A\x03\x02\x02\x02\bE\x03" +
		"\x02\x02\x02\nG\x03\x02\x02\x02\fK\x03\x02\x02\x02\x0E\x98\x03\x02\x02" +
		"\x02\x10\x11\x05\x04\x03\x02\x11\x12\x07\x02\x02\x03\x12\x03\x03\x02\x02" +
		"\x02\x13\x14\x05\x06\x04\x02\x14\x15\x07\x03\x02\x02\x15\x16\x05\x04\x03" +
		"\x02\x16\x19\x03\x02\x02\x02\x17\x19\x07\x02\x02\x03\x18\x13\x03\x02\x02" +
		"\x02\x18\x17\x03\x02\x02\x02\x19\x05\x03\x02\x02\x02\x1A\x1B\x07\f\x02" +
		"\x02\x1B\x1E\x07 \x02\x02\x1C\x1D\x07\x12\x02\x02\x1D\x1F\x07 \x02\x02" +
		"\x1E\x1C\x03\x02\x02\x02\x1E\x1F\x03\x02\x02\x02\x1F \x03\x02\x02\x02" +
		" &\x07\x04\x02\x02!\"\x05\b\x05\x02\"#\x07\x03\x02\x02#%\x03\x02\x02\x02" +
		"$!\x03\x02\x02\x02%(\x03\x02\x02\x02&$\x03\x02\x02\x02&\'\x03\x02\x02" +
		"\x02\')\x03\x02\x02\x02(&\x03\x02\x02\x02)*\x07\x05\x02\x02*\x07\x03\x02" +
		"\x02\x02+,\x07!\x02\x02,5\x07\x06\x02\x02-2\x05\n\x06\x02./\x07\x07\x02" +
		"\x02/1\x05\n\x06\x020.\x03\x02\x02\x0214\x03\x02\x02\x0220\x03\x02\x02" +
		"\x0223\x03\x02\x02\x0236\x03\x02\x02\x0242\x03\x02\x02\x025-\x03\x02\x02" +
		"\x0256\x03\x02\x02\x0267\x03\x02\x02\x0278\x07\b\x02\x0289\x07\t\x02\x02" +
		"9:\x07 \x02\x02:;\x07\x04\x02\x02;<\x05\x0E\b\x02<=\x07\x05\x02\x02=F" +
		"\x03\x02\x02\x02>?\x07!\x02\x02?@\x07\t\x02\x02@C\x07 \x02\x02AB\x07\"" +
		"\x02\x02BD\x05\x0E\b\x02CA\x03\x02\x02\x02CD\x03\x02\x02\x02DF\x03\x02" +
		"\x02\x02E+\x03\x02\x02\x02E>\x03\x02\x02\x02F\t\x03\x02\x02\x02GH\x07" +
		"!\x02\x02HI\x07\t\x02\x02IJ\x07 \x02\x02J\v\x03\x02\x02\x02KL\x07!\x02" +
		"\x02LM\x07\t\x02\x02MP\x07 \x02\x02NO\x07\"\x02\x02OQ\x05\x0E\b\x02PN" +
		"\x03\x02\x02\x02PQ\x03\x02\x02\x02Q\r\x03\x02\x02\x02RS\b\b\x01\x02ST" +
		"\x07!\x02\x02T]\x07\x06\x02\x02UZ\x05\x0E\b\x02VW\x07\x07\x02\x02WY\x05" +
		"\x0E\b\x02XV\x03\x02\x02\x02Y\\\x03\x02\x02\x02ZX\x03\x02\x02\x02Z[\x03" +
		"\x02\x02\x02[^\x03\x02\x02\x02\\Z\x03\x02\x02\x02]U\x03\x02\x02\x02]^" +
		"\x03\x02\x02\x02^_\x03\x02\x02\x02_\x99\x07\b\x02\x02`a\x07\x10\x02\x02" +
		"ab\x05\x0E\b\x02bc\x07\x17\x02\x02cd\x05\x0E\b\x02de\x07\r\x02\x02ef\x05" +
		"\x0E\b\x02fg\x07\x0F\x02\x02g\x99\x03\x02\x02\x02hi\x07\x18\x02\x02ij" +
		"\x05\x0E\b\x02jk\x07\x15\x02\x02kl\x05\x0E\b\x02lm\x07\x16\x02\x02m\x99" +
		"\x03\x02\x02\x02nr\x07\x04\x02\x02op\x05\x0E\b\x02pq\x07\x03\x02\x02q" +
		"s\x03\x02\x02\x02ro\x03\x02\x02\x02st\x03\x02\x02\x02tr\x03\x02\x02\x02" +
		"tu\x03\x02\x02\x02uv\x03\x02\x02\x02vw\x07\x05\x02\x02w\x99\x03\x02\x02" +
		"\x02xy\x07\x14\x02\x02y~\x05\f\x07\x02z{\x07\x07\x02\x02{}\x05\f\x07\x02" +
		"|z\x03\x02\x02\x02}\x80\x03\x02\x02\x02~|\x03\x02\x02\x02~\x7F\x03\x02" +
		"\x02\x02\x7F\x81\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x81\x82\x07\x11" +
		"\x02\x02\x82\x83\x05\x0E\b\x15\x83\x99\x03\x02\x02\x02\x84\x85\x07\x1B" +
		"\x02\x02\x85\x99\x07 \x02\x02\x86\x87\x07+\x02\x02\x87\x99\x05\x0E\b\x13" +
		"\x88\x89\x07\x13\x02\x02\x89\x99\x05\x0E\b\x12\x8A\x8B\x07+\x02\x02\x8B" +
		"\x99\x05\x0E\b\n\x8C\x8D\x07\x06\x02\x02\x8D\x8E\x05\x0E\b\x02\x8E\x8F" +
		"\x07\b\x02\x02\x8F\x99\x03\x02\x02\x02\x90\x99\x07!\x02\x02\x91\x99\x07" +
		"\x1F\x02\x02\x92\x99\x07\x1E\x02\x02\x93\x99\x07\x1D\x02\x02\x94\x99\x07" +
		"\x0E\x02\x02\x95\x96\x07!\x02\x02\x96\x97\x07\"\x02\x02\x97\x99\x05\x0E" +
		"\b\x03\x98R\x03\x02\x02\x02\x98`\x03\x02\x02\x02\x98h\x03\x02\x02\x02" +
		"\x98n\x03\x02\x02\x02\x98x\x03\x02\x02\x02\x98\x84\x03\x02\x02\x02\x98" +
		"\x86\x03\x02\x02\x02\x98\x88\x03\x02\x02\x02\x98\x8A\x03\x02\x02\x02\x98" +
		"\x8C\x03\x02\x02\x02\x98\x90\x03\x02\x02\x02\x98\x91\x03\x02\x02\x02\x98" +
		"\x92\x03\x02\x02\x02\x98\x93\x03\x02\x02\x02\x98\x94\x03\x02\x02\x02\x98" +
		"\x95\x03\x02\x02\x02\x99\xC4\x03\x02\x02\x02\x9A\x9B\f\x11\x02\x02\x9B" +
		"\x9C\x07&\x02\x02\x9C\xC3\x05\x0E\b\x12\x9D\x9E\f\x10\x02\x02\x9E\x9F" +
		"\x07\'\x02\x02\x9F\xC3\x05\x0E\b\x11\xA0\xA1\f\x0F\x02\x02\xA1\xA2\x07" +
		"$\x02\x02\xA2\xC3\x05\x0E\b\x10\xA3\xA4\f\x0E\x02\x02\xA4\xA5\x07%\x02" +
		"\x02\xA5\xC3\x05\x0E\b\x0F\xA6\xA7\f\r\x02\x02\xA7\xA8\x07(\x02\x02\xA8" +
		"\xC3\x05\x0E\b\x0E\xA9\xAA\f\f\x02\x02\xAA\xAB\x07)\x02\x02\xAB\xC3\x05" +
		"\x0E\b\r\xAC\xAD\f\v\x02\x02\xAD\xAE\x07*\x02\x02\xAE\xC3\x05\x0E\b\f" +
		"\xAF\xB2\f\x1A\x02\x02\xB0\xB1\x07\n\x02\x02\xB1\xB3\x07 \x02\x02\xB2" +
		"\xB0\x03\x02\x02\x02\xB2\xB3\x03\x02\x02\x02\xB3\xB4\x03\x02\x02\x02\xB4" +
		"\xB5\x07\v\x02\x02\xB5\xB6\x07!\x02\x02\xB6\xBF\x07\x06\x02\x02\xB7\xBC" +
		"\x05\x0E\b\x02\xB8\xB9\x07\x07\x02\x02\xB9\xBB\x05\x0E\b\x02\xBA\xB8\x03" +
		"\x02\x02\x02\xBB\xBE\x03\x02\x02\x02\xBC\xBA\x03\x02\x02\x02\xBC\xBD\x03" +
		"\x02\x02\x02\xBD\xC0\x03\x02\x02\x02\xBE\xBC\x03\x02\x02\x02\xBF\xB7\x03" +
		"\x02\x02\x02\xBF\xC0\x03\x02\x02\x02\xC0\xC1\x03\x02\x02\x02\xC1\xC3\x07" +
		"\b\x02\x02\xC2\x9A\x03\x02\x02\x02\xC2\x9D\x03\x02\x02\x02\xC2\xA0\x03" +
		"\x02\x02\x02\xC2\xA3\x03\x02\x02\x02\xC2\xA6\x03\x02\x02\x02\xC2\xA9\x03" +
		"\x02\x02\x02\xC2\xAC\x03\x02\x02\x02\xC2\xAF\x03\x02\x02\x02\xC3\xC6\x03" +
		"\x02\x02\x02\xC4\xC2\x03\x02\x02\x02\xC4\xC5\x03\x02\x02\x02\xC5\x0F\x03" +
		"\x02\x02\x02\xC6\xC4\x03\x02\x02\x02\x14\x18\x1E&25CEPZ]t~\x98\xB2\xBC" +
		"\xBF\xC2\xC4";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!yaplParser.__ATN) {
			yaplParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(yaplParser._serializedATN));
		}

		return yaplParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public programBlocks(): ProgramBlocksContext {
		return this.getRuleContext(0, ProgramBlocksContext);
	}
	public EOF(): TerminalNode { return this.getToken(yaplParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_program; }
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ProgramBlocksContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_programBlocks; }
	public copyFrom(ctx: ProgramBlocksContext): void {
		super.copyFrom(ctx);
	}
}
export class ClassesContext extends ProgramBlocksContext {
	public classDefine(): ClassDefineContext {
		return this.getRuleContext(0, ClassDefineContext);
	}
	public programBlocks(): ProgramBlocksContext {
		return this.getRuleContext(0, ProgramBlocksContext);
	}
	constructor(ctx: ProgramBlocksContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterClasses) {
			listener.enterClasses(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitClasses) {
			listener.exitClasses(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitClasses) {
			return visitor.visitClasses(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EofContext extends ProgramBlocksContext {
	public EOF(): TerminalNode { return this.getToken(yaplParser.EOF, 0); }
	constructor(ctx: ProgramBlocksContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterEof) {
			listener.enterEof(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitEof) {
			listener.exitEof(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitEof) {
			return visitor.visitEof(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDefineContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(yaplParser.CLASS, 0); }
	public TYPE(): TerminalNode[];
	public TYPE(i: number): TerminalNode;
	public TYPE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(yaplParser.TYPE);
		} else {
			return this.getToken(yaplParser.TYPE, i);
		}
	}
	public INHERITS(): TerminalNode | undefined { return this.tryGetToken(yaplParser.INHERITS, 0); }
	public feature(): FeatureContext[];
	public feature(i: number): FeatureContext;
	public feature(i?: number): FeatureContext | FeatureContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FeatureContext);
		} else {
			return this.getRuleContext(i, FeatureContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_classDefine; }
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterClassDefine) {
			listener.enterClassDefine(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitClassDefine) {
			listener.exitClassDefine(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitClassDefine) {
			return visitor.visitClassDefine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeatureContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_feature; }
	public copyFrom(ctx: FeatureContext): void {
		super.copyFrom(ctx);
	}
}
export class MethodContext extends FeatureContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public TYPE(): TerminalNode { return this.getToken(yaplParser.TYPE, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public formal(): FormalContext[];
	public formal(i: number): FormalContext;
	public formal(i?: number): FormalContext | FormalContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FormalContext);
		} else {
			return this.getRuleContext(i, FormalContext);
		}
	}
	constructor(ctx: FeatureContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterMethod) {
			listener.enterMethod(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitMethod) {
			listener.exitMethod(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitMethod) {
			return visitor.visitMethod(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PropertyContext extends FeatureContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public TYPE(): TerminalNode { return this.getToken(yaplParser.TYPE, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(yaplParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(ctx: FeatureContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterProperty) {
			listener.enterProperty(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitProperty) {
			listener.exitProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitProperty) {
			return visitor.visitProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormalContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public TYPE(): TerminalNode { return this.getToken(yaplParser.TYPE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_formal; }
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterFormal) {
			listener.enterFormal(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitFormal) {
			listener.exitFormal(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitFormal) {
			return visitor.visitFormal(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentExprContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public TYPE(): TerminalNode { return this.getToken(yaplParser.TYPE, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(yaplParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_assignmentExpr; }
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterAssignmentExpr) {
			listener.enterAssignmentExpr(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitAssignmentExpr) {
			listener.exitAssignmentExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitAssignmentExpr) {
			return visitor.visitAssignmentExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return yaplParser.RULE_expression; }
	public copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class MethodCallContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public TYPE(): TerminalNode | undefined { return this.tryGetToken(yaplParser.TYPE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterMethodCall) {
			listener.enterMethodCall(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitMethodCall) {
			listener.exitMethodCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitMethodCall) {
			return visitor.visitMethodCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OwnMethodCallContext extends ExpressionContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterOwnMethodCall) {
			listener.enterOwnMethodCall(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitOwnMethodCall) {
			listener.exitOwnMethodCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitOwnMethodCall) {
			return visitor.visitOwnMethodCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IfContext extends ExpressionContext {
	public IF(): TerminalNode { return this.getToken(yaplParser.IF, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public THEN(): TerminalNode { return this.getToken(yaplParser.THEN, 0); }
	public ELSE(): TerminalNode { return this.getToken(yaplParser.ELSE, 0); }
	public FI(): TerminalNode { return this.getToken(yaplParser.FI, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterIf) {
			listener.enterIf(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitIf) {
			listener.exitIf(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitIf) {
			return visitor.visitIf(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class WhileContext extends ExpressionContext {
	public WHILE(): TerminalNode { return this.getToken(yaplParser.WHILE, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public LOOP(): TerminalNode { return this.getToken(yaplParser.LOOP, 0); }
	public POOL(): TerminalNode { return this.getToken(yaplParser.POOL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterWhile) {
			listener.enterWhile(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitWhile) {
			listener.exitWhile(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitWhile) {
			return visitor.visitWhile(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BlockContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LetInContext extends ExpressionContext {
	public LET(): TerminalNode { return this.getToken(yaplParser.LET, 0); }
	public assignmentExpr(): AssignmentExprContext[];
	public assignmentExpr(i: number): AssignmentExprContext;
	public assignmentExpr(i?: number): AssignmentExprContext | AssignmentExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AssignmentExprContext);
		} else {
			return this.getRuleContext(i, AssignmentExprContext);
		}
	}
	public IN(): TerminalNode { return this.getToken(yaplParser.IN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterLetIn) {
			listener.enterLetIn(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitLetIn) {
			listener.exitLetIn(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitLetIn) {
			return visitor.visitLetIn(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NewContext extends ExpressionContext {
	public NEW(): TerminalNode { return this.getToken(yaplParser.NEW, 0); }
	public TYPE(): TerminalNode { return this.getToken(yaplParser.TYPE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterNew) {
			listener.enterNew(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitNew) {
			listener.exitNew(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitNew) {
			return visitor.visitNew(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NegativeContext extends ExpressionContext {
	public INTEGER_NEGATIVE(): TerminalNode { return this.getToken(yaplParser.INTEGER_NEGATIVE, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterNegative) {
			listener.enterNegative(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitNegative) {
			listener.exitNegative(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitNegative) {
			return visitor.visitNegative(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IsvoidContext extends ExpressionContext {
	public ISVOID(): TerminalNode { return this.getToken(yaplParser.ISVOID, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterIsvoid) {
			listener.enterIsvoid(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitIsvoid) {
			listener.exitIsvoid(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitIsvoid) {
			return visitor.visitIsvoid(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiplyContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public MULTIPLY(): TerminalNode { return this.getToken(yaplParser.MULTIPLY, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterMultiply) {
			listener.enterMultiply(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitMultiply) {
			listener.exitMultiply(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitMultiply) {
			return visitor.visitMultiply(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DivisionContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public DIVISION(): TerminalNode { return this.getToken(yaplParser.DIVISION, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterDivision) {
			listener.enterDivision(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitDivision) {
			listener.exitDivision(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitDivision) {
			return visitor.visitDivision(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AddContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public ADD(): TerminalNode { return this.getToken(yaplParser.ADD, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterAdd) {
			listener.enterAdd(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitAdd) {
			listener.exitAdd(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitAdd) {
			return visitor.visitAdd(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MinusContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public MINUS(): TerminalNode { return this.getToken(yaplParser.MINUS, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterMinus) {
			listener.enterMinus(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitMinus) {
			listener.exitMinus(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitMinus) {
			return visitor.visitMinus(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LessThanContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public LESS_THAN(): TerminalNode { return this.getToken(yaplParser.LESS_THAN, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterLessThan) {
			listener.enterLessThan(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitLessThan) {
			listener.exitLessThan(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitLessThan) {
			return visitor.visitLessThan(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LessEqualContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public LESS_EQUAL(): TerminalNode { return this.getToken(yaplParser.LESS_EQUAL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterLessEqual) {
			listener.enterLessEqual(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitLessEqual) {
			listener.exitLessEqual(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitLessEqual) {
			return visitor.visitLessEqual(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EqualContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public EQUAL(): TerminalNode { return this.getToken(yaplParser.EQUAL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterEqual) {
			listener.enterEqual(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitEqual) {
			listener.exitEqual(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitEqual) {
			return visitor.visitEqual(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BoolNotContext extends ExpressionContext {
	public INTEGER_NEGATIVE(): TerminalNode { return this.getToken(yaplParser.INTEGER_NEGATIVE, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterBoolNot) {
			listener.enterBoolNot(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitBoolNot) {
			listener.exitBoolNot(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitBoolNot) {
			return visitor.visitBoolNot(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenthesesContext extends ExpressionContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterParentheses) {
			listener.enterParentheses(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitParentheses) {
			listener.exitParentheses(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitParentheses) {
			return visitor.visitParentheses(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdContext extends ExpressionContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterId) {
			listener.enterId(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitId) {
			listener.exitId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitId) {
			return visitor.visitId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IntContext extends ExpressionContext {
	public INT(): TerminalNode { return this.getToken(yaplParser.INT, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterInt) {
			listener.enterInt(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitInt) {
			listener.exitInt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitInt) {
			return visitor.visitInt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringContext extends ExpressionContext {
	public STRING(): TerminalNode { return this.getToken(yaplParser.STRING, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterString) {
			listener.enterString(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitString) {
			listener.exitString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitString) {
			return visitor.visitString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TrueContext extends ExpressionContext {
	public TRUE(): TerminalNode { return this.getToken(yaplParser.TRUE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterTrue) {
			listener.enterTrue(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitTrue) {
			listener.exitTrue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitTrue) {
			return visitor.visitTrue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FalseContext extends ExpressionContext {
	public FALSE(): TerminalNode { return this.getToken(yaplParser.FALSE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterFalse) {
			listener.enterFalse(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitFalse) {
			listener.exitFalse(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitFalse) {
			return visitor.visitFalse(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AssignmentContext extends ExpressionContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(yaplParser.IDENTIFIER, 0); }
	public ASSIGNMENT(): TerminalNode { return this.getToken(yaplParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: yaplListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: yaplListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: yaplVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


