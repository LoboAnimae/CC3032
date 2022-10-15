// Generated from /Users/yagdrassyl/Documents/Code/cmpsproy2_fix/yapl.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class yaplParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.9.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		CLASS=10, ELSE=11, FALSE=12, FI=13, IF=14, IN=15, INHERITS=16, ISVOID=17, 
		LET=18, LOOP=19, POOL=20, THEN=21, WHILE=22, CASE=23, ESAC=24, NEW=25, 
		OF=26, TRUE=27, STRING=28, INT=29, TYPE=30, IDENTIFIER=31, ASSIGNMENT=32, 
		CASE_ARROW=33, ADD=34, MINUS=35, MULTIPLY=36, DIVISION=37, LESS_THAN=38, 
		LESS_EQUAL=39, EQUAL=40, INTEGER_NEGATIVE=41, OPEN_COMMENT=42, CLOSE_COMMENT=43, 
		COMMENT=44, ONE_LINE_COMMENT=45, WHITESPACE=46;
	public static final int
		RULE_program = 0, RULE_programBlocks = 1, RULE_classDefine = 2, RULE_feature = 3, 
		RULE_formal = 4, RULE_assignmentExpr = 5, RULE_expression = 6;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "programBlocks", "classDefine", "feature", "formal", "assignmentExpr", 
			"expression"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "';'", "'{'", "'}'", "'('", "','", "')'", "':'", "'@'", "'.'", 
			null, null, "'false'", null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, "'true'", null, null, null, null, 
			"'<-'", "'=>'", "'+'", "'-'", "'*'", "'/'", "'<'", "'<='", "'='", "'~'", 
			"'(*'", "'*)'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, "CLASS", 
			"ELSE", "FALSE", "FI", "IF", "IN", "INHERITS", "ISVOID", "LET", "LOOP", 
			"POOL", "THEN", "WHILE", "CASE", "ESAC", "NEW", "OF", "TRUE", "STRING", 
			"INT", "TYPE", "IDENTIFIER", "ASSIGNMENT", "CASE_ARROW", "ADD", "MINUS", 
			"MULTIPLY", "DIVISION", "LESS_THAN", "LESS_EQUAL", "EQUAL", "INTEGER_NEGATIVE", 
			"OPEN_COMMENT", "CLOSE_COMMENT", "COMMENT", "ONE_LINE_COMMENT", "WHITESPACE"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "yapl.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public yaplParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class ProgramContext extends ParserRuleContext {
		public ProgramBlocksContext programBlocks() {
			return getRuleContext(ProgramBlocksContext.class,0);
		}
		public TerminalNode EOF() { return getToken(yaplParser.EOF, 0); }
		public ProgramContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_program; }
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(14);
			programBlocks();
			setState(15);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ProgramBlocksContext extends ParserRuleContext {
		public ProgramBlocksContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_programBlocks; }
	 
		public ProgramBlocksContext() { }
		public void copyFrom(ProgramBlocksContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class ClassesContext extends ProgramBlocksContext {
		public ClassDefineContext classDefine() {
			return getRuleContext(ClassDefineContext.class,0);
		}
		public ProgramBlocksContext programBlocks() {
			return getRuleContext(ProgramBlocksContext.class,0);
		}
		public ClassesContext(ProgramBlocksContext ctx) { copyFrom(ctx); }
	}
	public static class EofContext extends ProgramBlocksContext {
		public TerminalNode EOF() { return getToken(yaplParser.EOF, 0); }
		public EofContext(ProgramBlocksContext ctx) { copyFrom(ctx); }
	}

	public final ProgramBlocksContext programBlocks() throws RecognitionException {
		ProgramBlocksContext _localctx = new ProgramBlocksContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_programBlocks);
		try {
			setState(22);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case CLASS:
				_localctx = new ClassesContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(17);
				classDefine();
				setState(18);
				match(T__0);
				setState(19);
				programBlocks();
				}
				break;
			case EOF:
				_localctx = new EofContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(21);
				match(EOF);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassDefineContext extends ParserRuleContext {
		public TerminalNode CLASS() { return getToken(yaplParser.CLASS, 0); }
		public List<TerminalNode> TYPE() { return getTokens(yaplParser.TYPE); }
		public TerminalNode TYPE(int i) {
			return getToken(yaplParser.TYPE, i);
		}
		public TerminalNode INHERITS() { return getToken(yaplParser.INHERITS, 0); }
		public List<FeatureContext> feature() {
			return getRuleContexts(FeatureContext.class);
		}
		public FeatureContext feature(int i) {
			return getRuleContext(FeatureContext.class,i);
		}
		public ClassDefineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classDefine; }
	}

	public final ClassDefineContext classDefine() throws RecognitionException {
		ClassDefineContext _localctx = new ClassDefineContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_classDefine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(24);
			match(CLASS);
			setState(25);
			match(TYPE);
			setState(28);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==INHERITS) {
				{
				setState(26);
				match(INHERITS);
				setState(27);
				match(TYPE);
				}
			}

			setState(30);
			match(T__1);
			setState(36);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==IDENTIFIER) {
				{
				{
				setState(31);
				feature();
				setState(32);
				match(T__0);
				}
				}
				setState(38);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(39);
			match(T__2);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FeatureContext extends ParserRuleContext {
		public FeatureContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_feature; }
	 
		public FeatureContext() { }
		public void copyFrom(FeatureContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class MethodContext extends FeatureContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public List<FormalContext> formal() {
			return getRuleContexts(FormalContext.class);
		}
		public FormalContext formal(int i) {
			return getRuleContext(FormalContext.class,i);
		}
		public MethodContext(FeatureContext ctx) { copyFrom(ctx); }
	}
	public static class PropertyContext extends FeatureContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public TerminalNode ASSIGNMENT() { return getToken(yaplParser.ASSIGNMENT, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public PropertyContext(FeatureContext ctx) { copyFrom(ctx); }
	}

	public final FeatureContext feature() throws RecognitionException {
		FeatureContext _localctx = new FeatureContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_feature);
		int _la;
		try {
			setState(67);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				_localctx = new MethodContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(41);
				match(IDENTIFIER);
				setState(42);
				match(T__3);
				setState(51);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==IDENTIFIER) {
					{
					setState(43);
					formal();
					setState(48);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==T__4) {
						{
						{
						setState(44);
						match(T__4);
						setState(45);
						formal();
						}
						}
						setState(50);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					}
				}

				setState(53);
				match(T__5);
				setState(54);
				match(T__6);
				setState(55);
				match(TYPE);
				setState(56);
				match(T__1);
				setState(57);
				expression(0);
				setState(58);
				match(T__2);
				}
				break;
			case 2:
				_localctx = new PropertyContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(60);
				match(IDENTIFIER);
				setState(61);
				match(T__6);
				setState(62);
				match(TYPE);
				setState(65);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==ASSIGNMENT) {
					{
					setState(63);
					match(ASSIGNMENT);
					setState(64);
					expression(0);
					}
				}

				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FormalContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public FormalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_formal; }
	}

	public final FormalContext formal() throws RecognitionException {
		FormalContext _localctx = new FormalContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_formal);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(69);
			match(IDENTIFIER);
			setState(70);
			match(T__6);
			setState(71);
			match(TYPE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssignmentExprContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public TerminalNode ASSIGNMENT() { return getToken(yaplParser.ASSIGNMENT, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public AssignmentExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignmentExpr; }
	}

	public final AssignmentExprContext assignmentExpr() throws RecognitionException {
		AssignmentExprContext _localctx = new AssignmentExprContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_assignmentExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(73);
			match(IDENTIFIER);
			setState(74);
			match(T__6);
			setState(75);
			match(TYPE);
			setState(78);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ASSIGNMENT) {
				{
				setState(76);
				match(ASSIGNMENT);
				setState(77);
				expression(0);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExpressionContext extends ParserRuleContext {
		public ExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expression; }
	 
		public ExpressionContext() { }
		public void copyFrom(ExpressionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class AddContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode ADD() { return getToken(yaplParser.ADD, 0); }
		public AddContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LetInContext extends ExpressionContext {
		public TerminalNode LET() { return getToken(yaplParser.LET, 0); }
		public List<AssignmentExprContext> assignmentExpr() {
			return getRuleContexts(AssignmentExprContext.class);
		}
		public AssignmentExprContext assignmentExpr(int i) {
			return getRuleContext(AssignmentExprContext.class,i);
		}
		public TerminalNode IN() { return getToken(yaplParser.IN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public LetInContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class NewContext extends ExpressionContext {
		public TerminalNode NEW() { return getToken(yaplParser.NEW, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public NewContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ParenthesesContext extends ExpressionContext {
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ParenthesesContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MinusContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode MINUS() { return getToken(yaplParser.MINUS, 0); }
		public MinusContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class StringContext extends ExpressionContext {
		public TerminalNode STRING() { return getToken(yaplParser.STRING, 0); }
		public StringContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class IsvoidContext extends ExpressionContext {
		public TerminalNode ISVOID() { return getToken(yaplParser.ISVOID, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public IsvoidContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AssignmentContext extends ExpressionContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode ASSIGNMENT() { return getToken(yaplParser.ASSIGNMENT, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public AssignmentContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class FalseContext extends ExpressionContext {
		public TerminalNode FALSE() { return getToken(yaplParser.FALSE, 0); }
		public FalseContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class WhileContext extends ExpressionContext {
		public TerminalNode WHILE() { return getToken(yaplParser.WHILE, 0); }
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode LOOP() { return getToken(yaplParser.LOOP, 0); }
		public TerminalNode POOL() { return getToken(yaplParser.POOL, 0); }
		public WhileContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class IntContext extends ExpressionContext {
		public TerminalNode INT() { return getToken(yaplParser.INT, 0); }
		public IntContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class DivisionContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode DIVISION() { return getToken(yaplParser.DIVISION, 0); }
		public DivisionContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class EqualContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode EQUAL() { return getToken(yaplParser.EQUAL, 0); }
		public EqualContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class NegativeContext extends ExpressionContext {
		public TerminalNode INTEGER_NEGATIVE() { return getToken(yaplParser.INTEGER_NEGATIVE, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public NegativeContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BoolNotContext extends ExpressionContext {
		public TerminalNode INTEGER_NEGATIVE() { return getToken(yaplParser.INTEGER_NEGATIVE, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public BoolNotContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LessThanContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode LESS_THAN() { return getToken(yaplParser.LESS_THAN, 0); }
		public LessThanContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class TrueContext extends ExpressionContext {
		public TerminalNode TRUE() { return getToken(yaplParser.TRUE, 0); }
		public TrueContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BlockContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public BlockContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class IdContext extends ExpressionContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public IdContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LessEqualContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode LESS_EQUAL() { return getToken(yaplParser.LESS_EQUAL, 0); }
		public LessEqualContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MultiplyContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode MULTIPLY() { return getToken(yaplParser.MULTIPLY, 0); }
		public MultiplyContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class IfContext extends ExpressionContext {
		public TerminalNode IF() { return getToken(yaplParser.IF, 0); }
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode THEN() { return getToken(yaplParser.THEN, 0); }
		public TerminalNode ELSE() { return getToken(yaplParser.ELSE, 0); }
		public TerminalNode FI() { return getToken(yaplParser.FI, 0); }
		public IfContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class OwnMethodCallContext extends ExpressionContext {
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public OwnMethodCallContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MethodCallContext extends ExpressionContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode IDENTIFIER() { return getToken(yaplParser.IDENTIFIER, 0); }
		public TerminalNode TYPE() { return getToken(yaplParser.TYPE, 0); }
		public MethodCallContext(ExpressionContext ctx) { copyFrom(ctx); }
	}

	public final ExpressionContext expression() throws RecognitionException {
		return expression(0);
	}

	private ExpressionContext expression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		ExpressionContext _localctx = new ExpressionContext(_ctx, _parentState);
		ExpressionContext _prevctx = _localctx;
		int _startState = 12;
		enterRecursionRule(_localctx, 12, RULE_expression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(150);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,12,_ctx) ) {
			case 1:
				{
				_localctx = new OwnMethodCallContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(81);
				match(IDENTIFIER);
				setState(82);
				match(T__3);
				setState(91);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__1) | (1L << T__3) | (1L << FALSE) | (1L << IF) | (1L << ISVOID) | (1L << LET) | (1L << WHILE) | (1L << NEW) | (1L << TRUE) | (1L << STRING) | (1L << INT) | (1L << IDENTIFIER) | (1L << INTEGER_NEGATIVE))) != 0)) {
					{
					setState(83);
					expression(0);
					setState(88);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==T__4) {
						{
						{
						setState(84);
						match(T__4);
						setState(85);
						expression(0);
						}
						}
						setState(90);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					}
				}

				setState(93);
				match(T__5);
				}
				break;
			case 2:
				{
				_localctx = new IfContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(94);
				match(IF);
				setState(95);
				expression(0);
				setState(96);
				match(THEN);
				setState(97);
				expression(0);
				setState(98);
				match(ELSE);
				setState(99);
				expression(0);
				setState(100);
				match(FI);
				}
				break;
			case 3:
				{
				_localctx = new WhileContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(102);
				match(WHILE);
				setState(103);
				expression(0);
				setState(104);
				match(LOOP);
				setState(105);
				expression(0);
				setState(106);
				match(POOL);
				}
				break;
			case 4:
				{
				_localctx = new BlockContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(108);
				match(T__1);
				setState(112); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(109);
					expression(0);
					setState(110);
					match(T__0);
					}
					}
					setState(114); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__1) | (1L << T__3) | (1L << FALSE) | (1L << IF) | (1L << ISVOID) | (1L << LET) | (1L << WHILE) | (1L << NEW) | (1L << TRUE) | (1L << STRING) | (1L << INT) | (1L << IDENTIFIER) | (1L << INTEGER_NEGATIVE))) != 0) );
				setState(116);
				match(T__2);
				}
				break;
			case 5:
				{
				_localctx = new LetInContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(118);
				match(LET);
				setState(119);
				assignmentExpr();
				setState(124);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__4) {
					{
					{
					setState(120);
					match(T__4);
					setState(121);
					assignmentExpr();
					}
					}
					setState(126);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(127);
				match(IN);
				setState(128);
				expression(19);
				}
				break;
			case 6:
				{
				_localctx = new NewContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(130);
				match(NEW);
				setState(131);
				match(TYPE);
				}
				break;
			case 7:
				{
				_localctx = new NegativeContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(132);
				match(INTEGER_NEGATIVE);
				setState(133);
				expression(17);
				}
				break;
			case 8:
				{
				_localctx = new IsvoidContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(134);
				match(ISVOID);
				setState(135);
				expression(16);
				}
				break;
			case 9:
				{
				_localctx = new BoolNotContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(136);
				match(INTEGER_NEGATIVE);
				setState(137);
				expression(8);
				}
				break;
			case 10:
				{
				_localctx = new ParenthesesContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(138);
				match(T__3);
				setState(139);
				expression(0);
				setState(140);
				match(T__5);
				}
				break;
			case 11:
				{
				_localctx = new IdContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(142);
				match(IDENTIFIER);
				}
				break;
			case 12:
				{
				_localctx = new IntContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(143);
				match(INT);
				}
				break;
			case 13:
				{
				_localctx = new StringContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(144);
				match(STRING);
				}
				break;
			case 14:
				{
				_localctx = new TrueContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(145);
				match(TRUE);
				}
				break;
			case 15:
				{
				_localctx = new FalseContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(146);
				match(FALSE);
				}
				break;
			case 16:
				{
				_localctx = new AssignmentContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(147);
				match(IDENTIFIER);
				setState(148);
				match(ASSIGNMENT);
				setState(149);
				expression(1);
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(194);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(192);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
					case 1:
						{
						_localctx = new MultiplyContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(152);
						if (!(precpred(_ctx, 15))) throw new FailedPredicateException(this, "precpred(_ctx, 15)");
						setState(153);
						match(MULTIPLY);
						setState(154);
						expression(16);
						}
						break;
					case 2:
						{
						_localctx = new DivisionContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(155);
						if (!(precpred(_ctx, 14))) throw new FailedPredicateException(this, "precpred(_ctx, 14)");
						setState(156);
						match(DIVISION);
						setState(157);
						expression(15);
						}
						break;
					case 3:
						{
						_localctx = new AddContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(158);
						if (!(precpred(_ctx, 13))) throw new FailedPredicateException(this, "precpred(_ctx, 13)");
						setState(159);
						match(ADD);
						setState(160);
						expression(14);
						}
						break;
					case 4:
						{
						_localctx = new MinusContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(161);
						if (!(precpred(_ctx, 12))) throw new FailedPredicateException(this, "precpred(_ctx, 12)");
						setState(162);
						match(MINUS);
						setState(163);
						expression(13);
						}
						break;
					case 5:
						{
						_localctx = new LessThanContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(164);
						if (!(precpred(_ctx, 11))) throw new FailedPredicateException(this, "precpred(_ctx, 11)");
						setState(165);
						match(LESS_THAN);
						setState(166);
						expression(12);
						}
						break;
					case 6:
						{
						_localctx = new LessEqualContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(167);
						if (!(precpred(_ctx, 10))) throw new FailedPredicateException(this, "precpred(_ctx, 10)");
						setState(168);
						match(LESS_EQUAL);
						setState(169);
						expression(11);
						}
						break;
					case 7:
						{
						_localctx = new EqualContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(170);
						if (!(precpred(_ctx, 9))) throw new FailedPredicateException(this, "precpred(_ctx, 9)");
						setState(171);
						match(EQUAL);
						setState(172);
						expression(10);
						}
						break;
					case 8:
						{
						_localctx = new MethodCallContext(new ExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(173);
						if (!(precpred(_ctx, 24))) throw new FailedPredicateException(this, "precpred(_ctx, 24)");
						setState(176);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if (_la==T__7) {
							{
							setState(174);
							match(T__7);
							setState(175);
							match(TYPE);
							}
						}

						setState(178);
						match(T__8);
						setState(179);
						match(IDENTIFIER);
						setState(180);
						match(T__3);
						setState(189);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__1) | (1L << T__3) | (1L << FALSE) | (1L << IF) | (1L << ISVOID) | (1L << LET) | (1L << WHILE) | (1L << NEW) | (1L << TRUE) | (1L << STRING) | (1L << INT) | (1L << IDENTIFIER) | (1L << INTEGER_NEGATIVE))) != 0)) {
							{
							setState(181);
							expression(0);
							setState(186);
							_errHandler.sync(this);
							_la = _input.LA(1);
							while (_la==T__4) {
								{
								{
								setState(182);
								match(T__4);
								setState(183);
								expression(0);
								}
								}
								setState(188);
								_errHandler.sync(this);
								_la = _input.LA(1);
							}
							}
						}

						setState(191);
						match(T__5);
						}
						break;
					}
					} 
				}
				setState(196);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 6:
			return expression_sempred((ExpressionContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean expression_sempred(ExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 15);
		case 1:
			return precpred(_ctx, 14);
		case 2:
			return precpred(_ctx, 13);
		case 3:
			return precpred(_ctx, 12);
		case 4:
			return precpred(_ctx, 11);
		case 5:
			return precpred(_ctx, 10);
		case 6:
			return precpred(_ctx, 9);
		case 7:
			return precpred(_ctx, 24);
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\60\u00c8\4\2\t\2"+
		"\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\3\2\3\2\3\2\3\3\3\3\3"+
		"\3\3\3\3\3\5\3\31\n\3\3\4\3\4\3\4\3\4\5\4\37\n\4\3\4\3\4\3\4\3\4\7\4%"+
		"\n\4\f\4\16\4(\13\4\3\4\3\4\3\5\3\5\3\5\3\5\3\5\7\5\61\n\5\f\5\16\5\64"+
		"\13\5\5\5\66\n\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\5\5D"+
		"\n\5\5\5F\n\5\3\6\3\6\3\6\3\6\3\7\3\7\3\7\3\7\3\7\5\7Q\n\7\3\b\3\b\3\b"+
		"\3\b\3\b\3\b\7\bY\n\b\f\b\16\b\\\13\b\5\b^\n\b\3\b\3\b\3\b\3\b\3\b\3\b"+
		"\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\6\bs\n\b\r\b\16\b"+
		"t\3\b\3\b\3\b\3\b\3\b\3\b\7\b}\n\b\f\b\16\b\u0080\13\b\3\b\3\b\3\b\3\b"+
		"\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3"+
		"\b\3\b\5\b\u0099\n\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3"+
		"\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\5\b\u00b3\n\b\3\b\3\b\3"+
		"\b\3\b\3\b\3\b\7\b\u00bb\n\b\f\b\16\b\u00be\13\b\5\b\u00c0\n\b\3\b\7\b"+
		"\u00c3\n\b\f\b\16\b\u00c6\13\b\3\b\2\3\16\t\2\4\6\b\n\f\16\2\2\2\u00e6"+
		"\2\20\3\2\2\2\4\30\3\2\2\2\6\32\3\2\2\2\bE\3\2\2\2\nG\3\2\2\2\fK\3\2\2"+
		"\2\16\u0098\3\2\2\2\20\21\5\4\3\2\21\22\7\2\2\3\22\3\3\2\2\2\23\24\5\6"+
		"\4\2\24\25\7\3\2\2\25\26\5\4\3\2\26\31\3\2\2\2\27\31\7\2\2\3\30\23\3\2"+
		"\2\2\30\27\3\2\2\2\31\5\3\2\2\2\32\33\7\f\2\2\33\36\7 \2\2\34\35\7\22"+
		"\2\2\35\37\7 \2\2\36\34\3\2\2\2\36\37\3\2\2\2\37 \3\2\2\2 &\7\4\2\2!\""+
		"\5\b\5\2\"#\7\3\2\2#%\3\2\2\2$!\3\2\2\2%(\3\2\2\2&$\3\2\2\2&\'\3\2\2\2"+
		"\')\3\2\2\2(&\3\2\2\2)*\7\5\2\2*\7\3\2\2\2+,\7!\2\2,\65\7\6\2\2-\62\5"+
		"\n\6\2./\7\7\2\2/\61\5\n\6\2\60.\3\2\2\2\61\64\3\2\2\2\62\60\3\2\2\2\62"+
		"\63\3\2\2\2\63\66\3\2\2\2\64\62\3\2\2\2\65-\3\2\2\2\65\66\3\2\2\2\66\67"+
		"\3\2\2\2\678\7\b\2\289\7\t\2\29:\7 \2\2:;\7\4\2\2;<\5\16\b\2<=\7\5\2\2"+
		"=F\3\2\2\2>?\7!\2\2?@\7\t\2\2@C\7 \2\2AB\7\"\2\2BD\5\16\b\2CA\3\2\2\2"+
		"CD\3\2\2\2DF\3\2\2\2E+\3\2\2\2E>\3\2\2\2F\t\3\2\2\2GH\7!\2\2HI\7\t\2\2"+
		"IJ\7 \2\2J\13\3\2\2\2KL\7!\2\2LM\7\t\2\2MP\7 \2\2NO\7\"\2\2OQ\5\16\b\2"+
		"PN\3\2\2\2PQ\3\2\2\2Q\r\3\2\2\2RS\b\b\1\2ST\7!\2\2T]\7\6\2\2UZ\5\16\b"+
		"\2VW\7\7\2\2WY\5\16\b\2XV\3\2\2\2Y\\\3\2\2\2ZX\3\2\2\2Z[\3\2\2\2[^\3\2"+
		"\2\2\\Z\3\2\2\2]U\3\2\2\2]^\3\2\2\2^_\3\2\2\2_\u0099\7\b\2\2`a\7\20\2"+
		"\2ab\5\16\b\2bc\7\27\2\2cd\5\16\b\2de\7\r\2\2ef\5\16\b\2fg\7\17\2\2g\u0099"+
		"\3\2\2\2hi\7\30\2\2ij\5\16\b\2jk\7\25\2\2kl\5\16\b\2lm\7\26\2\2m\u0099"+
		"\3\2\2\2nr\7\4\2\2op\5\16\b\2pq\7\3\2\2qs\3\2\2\2ro\3\2\2\2st\3\2\2\2"+
		"tr\3\2\2\2tu\3\2\2\2uv\3\2\2\2vw\7\5\2\2w\u0099\3\2\2\2xy\7\24\2\2y~\5"+
		"\f\7\2z{\7\7\2\2{}\5\f\7\2|z\3\2\2\2}\u0080\3\2\2\2~|\3\2\2\2~\177\3\2"+
		"\2\2\177\u0081\3\2\2\2\u0080~\3\2\2\2\u0081\u0082\7\21\2\2\u0082\u0083"+
		"\5\16\b\25\u0083\u0099\3\2\2\2\u0084\u0085\7\33\2\2\u0085\u0099\7 \2\2"+
		"\u0086\u0087\7+\2\2\u0087\u0099\5\16\b\23\u0088\u0089\7\23\2\2\u0089\u0099"+
		"\5\16\b\22\u008a\u008b\7+\2\2\u008b\u0099\5\16\b\n\u008c\u008d\7\6\2\2"+
		"\u008d\u008e\5\16\b\2\u008e\u008f\7\b\2\2\u008f\u0099\3\2\2\2\u0090\u0099"+
		"\7!\2\2\u0091\u0099\7\37\2\2\u0092\u0099\7\36\2\2\u0093\u0099\7\35\2\2"+
		"\u0094\u0099\7\16\2\2\u0095\u0096\7!\2\2\u0096\u0097\7\"\2\2\u0097\u0099"+
		"\5\16\b\3\u0098R\3\2\2\2\u0098`\3\2\2\2\u0098h\3\2\2\2\u0098n\3\2\2\2"+
		"\u0098x\3\2\2\2\u0098\u0084\3\2\2\2\u0098\u0086\3\2\2\2\u0098\u0088\3"+
		"\2\2\2\u0098\u008a\3\2\2\2\u0098\u008c\3\2\2\2\u0098\u0090\3\2\2\2\u0098"+
		"\u0091\3\2\2\2\u0098\u0092\3\2\2\2\u0098\u0093\3\2\2\2\u0098\u0094\3\2"+
		"\2\2\u0098\u0095\3\2\2\2\u0099\u00c4\3\2\2\2\u009a\u009b\f\21\2\2\u009b"+
		"\u009c\7&\2\2\u009c\u00c3\5\16\b\22\u009d\u009e\f\20\2\2\u009e\u009f\7"+
		"\'\2\2\u009f\u00c3\5\16\b\21\u00a0\u00a1\f\17\2\2\u00a1\u00a2\7$\2\2\u00a2"+
		"\u00c3\5\16\b\20\u00a3\u00a4\f\16\2\2\u00a4\u00a5\7%\2\2\u00a5\u00c3\5"+
		"\16\b\17\u00a6\u00a7\f\r\2\2\u00a7\u00a8\7(\2\2\u00a8\u00c3\5\16\b\16"+
		"\u00a9\u00aa\f\f\2\2\u00aa\u00ab\7)\2\2\u00ab\u00c3\5\16\b\r\u00ac\u00ad"+
		"\f\13\2\2\u00ad\u00ae\7*\2\2\u00ae\u00c3\5\16\b\f\u00af\u00b2\f\32\2\2"+
		"\u00b0\u00b1\7\n\2\2\u00b1\u00b3\7 \2\2\u00b2\u00b0\3\2\2\2\u00b2\u00b3"+
		"\3\2\2\2\u00b3\u00b4\3\2\2\2\u00b4\u00b5\7\13\2\2\u00b5\u00b6\7!\2\2\u00b6"+
		"\u00bf\7\6\2\2\u00b7\u00bc\5\16\b\2\u00b8\u00b9\7\7\2\2\u00b9\u00bb\5"+
		"\16\b\2\u00ba\u00b8\3\2\2\2\u00bb\u00be\3\2\2\2\u00bc\u00ba\3\2\2\2\u00bc"+
		"\u00bd\3\2\2\2\u00bd\u00c0\3\2\2\2\u00be\u00bc\3\2\2\2\u00bf\u00b7\3\2"+
		"\2\2\u00bf\u00c0\3\2\2\2\u00c0\u00c1\3\2\2\2\u00c1\u00c3\7\b\2\2\u00c2"+
		"\u009a\3\2\2\2\u00c2\u009d\3\2\2\2\u00c2\u00a0\3\2\2\2\u00c2\u00a3\3\2"+
		"\2\2\u00c2\u00a6\3\2\2\2\u00c2\u00a9\3\2\2\2\u00c2\u00ac\3\2\2\2\u00c2"+
		"\u00af\3\2\2\2\u00c3\u00c6\3\2\2\2\u00c4\u00c2\3\2\2\2\u00c4\u00c5\3\2"+
		"\2\2\u00c5\17\3\2\2\2\u00c6\u00c4\3\2\2\2\24\30\36&\62\65CEPZ]t~\u0098"+
		"\u00b2\u00bc\u00bf\u00c2\u00c4";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}