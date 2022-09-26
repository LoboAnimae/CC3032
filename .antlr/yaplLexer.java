// Generated from /home/yagdrassyl/Documents/Code/University/compiladores/cmpsproy2_fix/yapl.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class yaplLexer extends Lexer {
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
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", 
			"CLASS", "ELSE", "FALSE", "FI", "IF", "IN", "INHERITS", "ISVOID", "LET", 
			"LOOP", "POOL", "THEN", "WHILE", "CASE", "ESAC", "NEW", "OF", "TRUE", 
			"STRING", "INT", "TYPE", "IDENTIFIER", "ASSIGNMENT", "CASE_ARROW", "ADD", 
			"MINUS", "MULTIPLY", "DIVISION", "LESS_THAN", "LESS_EQUAL", "EQUAL", 
			"INTEGER_NEGATIVE", "A", "C", "D", "E", "F", "H", "I", "L", "N", "O", 
			"P", "R", "S", "T", "U", "V", "W", "ESC", "UNICODE", "HEX", "OPEN_COMMENT", 
			"CLOSE_COMMENT", "COMMENT", "ONE_LINE_COMMENT", "WHITESPACE"
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


	public yaplLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "yapl.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\60\u017c\b\1\4\2"+
		"\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4"+
		"\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22"+
		"\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31"+
		"\t\31\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t"+
		" \4!\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t"+
		"+\4,\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t\62\4\63\t\63\4\64"+
		"\t\64\4\65\t\65\4\66\t\66\4\67\t\67\48\t8\49\t9\4:\t:\4;\t;\4<\t<\4=\t"+
		"=\4>\t>\4?\t?\4@\t@\4A\tA\4B\tB\4C\tC\3\2\3\2\3\3\3\3\3\4\3\4\3\5\3\5"+
		"\3\6\3\6\3\7\3\7\3\b\3\b\3\t\3\t\3\n\3\n\3\13\3\13\3\13\3\13\3\13\3\13"+
		"\3\f\3\f\3\f\3\f\3\f\3\r\3\r\3\r\3\r\3\r\3\r\3\16\3\16\3\16\3\17\3\17"+
		"\3\17\3\20\3\20\3\20\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\22"+
		"\3\22\3\22\3\22\3\22\3\22\3\22\3\23\3\23\3\23\3\23\3\24\3\24\3\24\3\24"+
		"\3\24\3\25\3\25\3\25\3\25\3\25\3\26\3\26\3\26\3\26\3\26\3\27\3\27\3\27"+
		"\3\27\3\27\3\27\3\30\3\30\3\30\3\30\3\30\3\31\3\31\3\31\3\31\3\31\3\32"+
		"\3\32\3\32\3\32\3\33\3\33\3\33\3\34\3\34\3\34\3\34\3\34\3\35\3\35\3\35"+
		"\7\35\u00f6\n\35\f\35\16\35\u00f9\13\35\3\35\3\35\3\36\6\36\u00fe\n\36"+
		"\r\36\16\36\u00ff\3\37\3\37\7\37\u0104\n\37\f\37\16\37\u0107\13\37\3 "+
		"\3 \7 \u010b\n \f \16 \u010e\13 \3!\3!\3!\3\"\3\"\3\"\3#\3#\3$\3$\3%\3"+
		"%\3&\3&\3\'\3\'\3(\3(\3(\3)\3)\3*\3*\3+\3+\3,\3,\3-\3-\3.\3.\3/\3/\3\60"+
		"\3\60\3\61\3\61\3\62\3\62\3\63\3\63\3\64\3\64\3\65\3\65\3\66\3\66\3\67"+
		"\3\67\38\38\39\39\3:\3:\3;\3;\3<\3<\3<\5<\u014c\n<\3=\3=\3=\3=\3=\3=\3"+
		">\3>\3?\3?\3?\3@\3@\3@\3A\3A\3A\7A\u015f\nA\fA\16A\u0162\13A\3A\3A\3A"+
		"\3A\3B\3B\3B\3B\7B\u016c\nB\fB\16B\u016f\13B\3B\5B\u0172\nB\3B\3B\3C\6"+
		"C\u0177\nC\rC\16C\u0178\3C\3C\3\u0160\2D\3\3\5\4\7\5\t\6\13\7\r\b\17\t"+
		"\21\n\23\13\25\f\27\r\31\16\33\17\35\20\37\21!\22#\23%\24\'\25)\26+\27"+
		"-\30/\31\61\32\63\33\65\34\67\359\36;\37= ?!A\"C#E$G%I&K\'M(O)Q*S+U\2"+
		"W\2Y\2[\2]\2_\2a\2c\2e\2g\2i\2k\2m\2o\2q\2s\2u\2w\2y\2{\2},\177-\u0081"+
		".\u0083/\u0085\60\3\2\34\4\2$$^^\3\2\62;\3\2C\\\6\2\62;C\\aac|\3\2c|\4"+
		"\2CCcc\4\2EEee\4\2FFff\4\2GGgg\4\2HHhh\4\2JJjj\4\2KKkk\4\2NNnn\4\2PPp"+
		"p\4\2QQqq\4\2RRrr\4\2TTtt\4\2UUuu\4\2VVvv\4\2WWww\4\2XXxx\4\2YYyy\n\2"+
		"$$\61\61^^ddhhppttvv\5\2\62;CHch\3\2\f\f\5\2\13\f\16\17\"\"\2\u0172\2"+
		"\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2"+
		"\2\2\17\3\2\2\2\2\21\3\2\2\2\2\23\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2"+
		"\31\3\2\2\2\2\33\3\2\2\2\2\35\3\2\2\2\2\37\3\2\2\2\2!\3\2\2\2\2#\3\2\2"+
		"\2\2%\3\2\2\2\2\'\3\2\2\2\2)\3\2\2\2\2+\3\2\2\2\2-\3\2\2\2\2/\3\2\2\2"+
		"\2\61\3\2\2\2\2\63\3\2\2\2\2\65\3\2\2\2\2\67\3\2\2\2\29\3\2\2\2\2;\3\2"+
		"\2\2\2=\3\2\2\2\2?\3\2\2\2\2A\3\2\2\2\2C\3\2\2\2\2E\3\2\2\2\2G\3\2\2\2"+
		"\2I\3\2\2\2\2K\3\2\2\2\2M\3\2\2\2\2O\3\2\2\2\2Q\3\2\2\2\2S\3\2\2\2\2}"+
		"\3\2\2\2\2\177\3\2\2\2\2\u0081\3\2\2\2\2\u0083\3\2\2\2\2\u0085\3\2\2\2"+
		"\3\u0087\3\2\2\2\5\u0089\3\2\2\2\7\u008b\3\2\2\2\t\u008d\3\2\2\2\13\u008f"+
		"\3\2\2\2\r\u0091\3\2\2\2\17\u0093\3\2\2\2\21\u0095\3\2\2\2\23\u0097\3"+
		"\2\2\2\25\u0099\3\2\2\2\27\u009f\3\2\2\2\31\u00a4\3\2\2\2\33\u00aa\3\2"+
		"\2\2\35\u00ad\3\2\2\2\37\u00b0\3\2\2\2!\u00b3\3\2\2\2#\u00bc\3\2\2\2%"+
		"\u00c3\3\2\2\2\'\u00c7\3\2\2\2)\u00cc\3\2\2\2+\u00d1\3\2\2\2-\u00d6\3"+
		"\2\2\2/\u00dc\3\2\2\2\61\u00e1\3\2\2\2\63\u00e6\3\2\2\2\65\u00ea\3\2\2"+
		"\2\67\u00ed\3\2\2\29\u00f2\3\2\2\2;\u00fd\3\2\2\2=\u0101\3\2\2\2?\u0108"+
		"\3\2\2\2A\u010f\3\2\2\2C\u0112\3\2\2\2E\u0115\3\2\2\2G\u0117\3\2\2\2I"+
		"\u0119\3\2\2\2K\u011b\3\2\2\2M\u011d\3\2\2\2O\u011f\3\2\2\2Q\u0122\3\2"+
		"\2\2S\u0124\3\2\2\2U\u0126\3\2\2\2W\u0128\3\2\2\2Y\u012a\3\2\2\2[\u012c"+
		"\3\2\2\2]\u012e\3\2\2\2_\u0130\3\2\2\2a\u0132\3\2\2\2c\u0134\3\2\2\2e"+
		"\u0136\3\2\2\2g\u0138\3\2\2\2i\u013a\3\2\2\2k\u013c\3\2\2\2m\u013e\3\2"+
		"\2\2o\u0140\3\2\2\2q\u0142\3\2\2\2s\u0144\3\2\2\2u\u0146\3\2\2\2w\u0148"+
		"\3\2\2\2y\u014d\3\2\2\2{\u0153\3\2\2\2}\u0155\3\2\2\2\177\u0158\3\2\2"+
		"\2\u0081\u015b\3\2\2\2\u0083\u0167\3\2\2\2\u0085\u0176\3\2\2\2\u0087\u0088"+
		"\7=\2\2\u0088\4\3\2\2\2\u0089\u008a\7}\2\2\u008a\6\3\2\2\2\u008b\u008c"+
		"\7\177\2\2\u008c\b\3\2\2\2\u008d\u008e\7*\2\2\u008e\n\3\2\2\2\u008f\u0090"+
		"\7.\2\2\u0090\f\3\2\2\2\u0091\u0092\7+\2\2\u0092\16\3\2\2\2\u0093\u0094"+
		"\7<\2\2\u0094\20\3\2\2\2\u0095\u0096\7B\2\2\u0096\22\3\2\2\2\u0097\u0098"+
		"\7\60\2\2\u0098\24\3\2\2\2\u0099\u009a\5W,\2\u009a\u009b\5c\62\2\u009b"+
		"\u009c\5U+\2\u009c\u009d\5m\67\2\u009d\u009e\5m\67\2\u009e\26\3\2\2\2"+
		"\u009f\u00a0\5[.\2\u00a0\u00a1\5c\62\2\u00a1\u00a2\5m\67\2\u00a2\u00a3"+
		"\5[.\2\u00a3\30\3\2\2\2\u00a4\u00a5\7h\2\2\u00a5\u00a6\7c\2\2\u00a6\u00a7"+
		"\7n\2\2\u00a7\u00a8\7u\2\2\u00a8\u00a9\7g\2\2\u00a9\32\3\2\2\2\u00aa\u00ab"+
		"\5]/\2\u00ab\u00ac\5a\61\2\u00ac\34\3\2\2\2\u00ad\u00ae\5a\61\2\u00ae"+
		"\u00af\5]/\2\u00af\36\3\2\2\2\u00b0\u00b1\5a\61\2\u00b1\u00b2\5e\63\2"+
		"\u00b2 \3\2\2\2\u00b3\u00b4\5a\61\2\u00b4\u00b5\5e\63\2\u00b5\u00b6\5"+
		"_\60\2\u00b6\u00b7\5[.\2\u00b7\u00b8\5k\66\2\u00b8\u00b9\5a\61\2\u00b9"+
		"\u00ba\5o8\2\u00ba\u00bb\5m\67\2\u00bb\"\3\2\2\2\u00bc\u00bd\5a\61\2\u00bd"+
		"\u00be\5m\67\2\u00be\u00bf\5s:\2\u00bf\u00c0\5g\64\2\u00c0\u00c1\5a\61"+
		"\2\u00c1\u00c2\5Y-\2\u00c2$\3\2\2\2\u00c3\u00c4\5c\62\2\u00c4\u00c5\5"+
		"[.\2\u00c5\u00c6\5o8\2\u00c6&\3\2\2\2\u00c7\u00c8\5c\62\2\u00c8\u00c9"+
		"\5g\64\2\u00c9\u00ca\5g\64\2\u00ca\u00cb\5i\65\2\u00cb(\3\2\2\2\u00cc"+
		"\u00cd\5i\65\2\u00cd\u00ce\5g\64\2\u00ce\u00cf\5g\64\2\u00cf\u00d0\5c"+
		"\62\2\u00d0*\3\2\2\2\u00d1\u00d2\5o8\2\u00d2\u00d3\5_\60\2\u00d3\u00d4"+
		"\5[.\2\u00d4\u00d5\5e\63\2\u00d5,\3\2\2\2\u00d6\u00d7\5u;\2\u00d7\u00d8"+
		"\5_\60\2\u00d8\u00d9\5a\61\2\u00d9\u00da\5c\62\2\u00da\u00db\5[.\2\u00db"+
		".\3\2\2\2\u00dc\u00dd\5W,\2\u00dd\u00de\5U+\2\u00de\u00df\5m\67\2\u00df"+
		"\u00e0\5[.\2\u00e0\60\3\2\2\2\u00e1\u00e2\5[.\2\u00e2\u00e3\5m\67\2\u00e3"+
		"\u00e4\5U+\2\u00e4\u00e5\5W,\2\u00e5\62\3\2\2\2\u00e6\u00e7\5e\63\2\u00e7"+
		"\u00e8\5[.\2\u00e8\u00e9\5u;\2\u00e9\64\3\2\2\2\u00ea\u00eb\5g\64\2\u00eb"+
		"\u00ec\5]/\2\u00ec\66\3\2\2\2\u00ed\u00ee\7v\2\2\u00ee\u00ef\7t\2\2\u00ef"+
		"\u00f0\7w\2\2\u00f0\u00f1\7g\2\2\u00f18\3\2\2\2\u00f2\u00f7\7$\2\2\u00f3"+
		"\u00f6\5w<\2\u00f4\u00f6\n\2\2\2\u00f5\u00f3\3\2\2\2\u00f5\u00f4\3\2\2"+
		"\2\u00f6\u00f9\3\2\2\2\u00f7\u00f5\3\2\2\2\u00f7\u00f8\3\2\2\2\u00f8\u00fa"+
		"\3\2\2\2\u00f9\u00f7\3\2\2\2\u00fa\u00fb\7$\2\2\u00fb:\3\2\2\2\u00fc\u00fe"+
		"\t\3\2\2\u00fd\u00fc\3\2\2\2\u00fe\u00ff\3\2\2\2\u00ff\u00fd\3\2\2\2\u00ff"+
		"\u0100\3\2\2\2\u0100<\3\2\2\2\u0101\u0105\t\4\2\2\u0102\u0104\t\5\2\2"+
		"\u0103\u0102\3\2\2\2\u0104\u0107\3\2\2\2\u0105\u0103\3\2\2\2\u0105\u0106"+
		"\3\2\2\2\u0106>\3\2\2\2\u0107\u0105\3\2\2\2\u0108\u010c\t\6\2\2\u0109"+
		"\u010b\t\5\2\2\u010a\u0109\3\2\2\2\u010b\u010e\3\2\2\2\u010c\u010a\3\2"+
		"\2\2\u010c\u010d\3\2\2\2\u010d@\3\2\2\2\u010e\u010c\3\2\2\2\u010f\u0110"+
		"\7>\2\2\u0110\u0111\7/\2\2\u0111B\3\2\2\2\u0112\u0113\7?\2\2\u0113\u0114"+
		"\7@\2\2\u0114D\3\2\2\2\u0115\u0116\7-\2\2\u0116F\3\2\2\2\u0117\u0118\7"+
		"/\2\2\u0118H\3\2\2\2\u0119\u011a\7,\2\2\u011aJ\3\2\2\2\u011b\u011c\7\61"+
		"\2\2\u011cL\3\2\2\2\u011d\u011e\7>\2\2\u011eN\3\2\2\2\u011f\u0120\7>\2"+
		"\2\u0120\u0121\7?\2\2\u0121P\3\2\2\2\u0122\u0123\7?\2\2\u0123R\3\2\2\2"+
		"\u0124\u0125\7\u0080\2\2\u0125T\3\2\2\2\u0126\u0127\t\7\2\2\u0127V\3\2"+
		"\2\2\u0128\u0129\t\b\2\2\u0129X\3\2\2\2\u012a\u012b\t\t\2\2\u012bZ\3\2"+
		"\2\2\u012c\u012d\t\n\2\2\u012d\\\3\2\2\2\u012e\u012f\t\13\2\2\u012f^\3"+
		"\2\2\2\u0130\u0131\t\f\2\2\u0131`\3\2\2\2\u0132\u0133\t\r\2\2\u0133b\3"+
		"\2\2\2\u0134\u0135\t\16\2\2\u0135d\3\2\2\2\u0136\u0137\t\17\2\2\u0137"+
		"f\3\2\2\2\u0138\u0139\t\20\2\2\u0139h\3\2\2\2\u013a\u013b\t\21\2\2\u013b"+
		"j\3\2\2\2\u013c\u013d\t\22\2\2\u013dl\3\2\2\2\u013e\u013f\t\23\2\2\u013f"+
		"n\3\2\2\2\u0140\u0141\t\24\2\2\u0141p\3\2\2\2\u0142\u0143\t\25\2\2\u0143"+
		"r\3\2\2\2\u0144\u0145\t\26\2\2\u0145t\3\2\2\2\u0146\u0147\t\27\2\2\u0147"+
		"v\3\2\2\2\u0148\u014b\7^\2\2\u0149\u014c\t\30\2\2\u014a\u014c\5y=\2\u014b"+
		"\u0149\3\2\2\2\u014b\u014a\3\2\2\2\u014cx\3\2\2\2\u014d\u014e\7w\2\2\u014e"+
		"\u014f\5{>\2\u014f\u0150\5{>\2\u0150\u0151\5{>\2\u0151\u0152\5{>\2\u0152"+
		"z\3\2\2\2\u0153\u0154\t\31\2\2\u0154|\3\2\2\2\u0155\u0156\7*\2\2\u0156"+
		"\u0157\7,\2\2\u0157~\3\2\2\2\u0158\u0159\7,\2\2\u0159\u015a\7+\2\2\u015a"+
		"\u0080\3\2\2\2\u015b\u0160\5}?\2\u015c\u015f\5\u0081A\2\u015d\u015f\13"+
		"\2\2\2\u015e\u015c\3\2\2\2\u015e\u015d\3\2\2\2\u015f\u0162\3\2\2\2\u0160"+
		"\u0161\3\2\2\2\u0160\u015e\3\2\2\2\u0161\u0163\3\2\2\2\u0162\u0160\3\2"+
		"\2\2\u0163\u0164\5\177@\2\u0164\u0165\3\2\2\2\u0165\u0166\bA\2\2\u0166"+
		"\u0082\3\2\2\2\u0167\u0168\7/\2\2\u0168\u0169\7/\2\2\u0169\u016d\3\2\2"+
		"\2\u016a\u016c\n\32\2\2\u016b\u016a\3\2\2\2\u016c\u016f\3\2\2\2\u016d"+
		"\u016b\3\2\2\2\u016d\u016e\3\2\2\2\u016e\u0171\3\2\2\2\u016f\u016d\3\2"+
		"\2\2\u0170\u0172\7\f\2\2\u0171\u0170\3\2\2\2\u0171\u0172\3\2\2\2\u0172"+
		"\u0173\3\2\2\2\u0173\u0174\bB\2\2\u0174\u0084\3\2\2\2\u0175\u0177\t\33"+
		"\2\2\u0176\u0175\3\2\2\2\u0177\u0178\3\2\2\2\u0178\u0176\3\2\2\2\u0178"+
		"\u0179\3\2\2\2\u0179\u017a\3\2\2\2\u017a\u017b\bC\2\2\u017b\u0086\3\2"+
		"\2\2\16\2\u00f5\u00f7\u00ff\u0105\u010c\u014b\u015e\u0160\u016d\u0171"+
		"\u0178\3\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}