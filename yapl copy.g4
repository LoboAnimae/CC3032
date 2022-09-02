grammar yapl;

program: programBlocks;

programBlocks:
	classDefinition ';' programBlocks	# Classes
	| EOF								# EOF;

classDefinition:
	CLASS TYPE (INHERITS TYPE)? '{' (feature ';')* '}';

feature: methodDefinition | attributeDefinition;

methodDefinition:
	IDENTIFIER '(' (FORMALPARAMETER (',' FORMALPARAMETER)*)? ')' ':' TYPE '{' expression '}';

attributeDefinition:
	IDENTIFIER ':' TYPE (ASSIGNMENT expression)?;

expression:
	expression ('@' TYPE)? '.' IDENTIFIER '(' (
		expression (',' expression)*
	)? ')'													# methodCall
	| IDENTIFIER '(' (expression (',' expression)*)? ')'	# ownMethodCall
	| IF expression THEN expression ELSE expression FI		# if
	| WHILE expression LOOP expression POOL					# while
	| '{' (expression ';')+ '}'								# block
	| LET IDENTIFIER ':' TYPE (ASSIGNMENT expression)? (
		',' IDENTIFIER ':' TYPE (ASSIGNMENT expression)?
	)* IN expression					# letIn
	| NEW TYPE							# new
	| ISVOID expression					# isvoid
	| expression MUL expression			# multiply
	| expression DIV expression			# division
	| expression ADD expression			# add
	| expression SUB expression			# minus
	| expression LT expression			# lessThan
	| expression LE expression			# lessEqual
	| expression EQ expression			# equal
	| '(' expression ')'				# parentheses
	| IDENTIFIER						# id
	| INT								# int
	| STRING							# string
	| TRUE								# true
	| FALSE								# false
	| IDENTIFIER ASSIGNMENT expression	# assignment
	| NUMBER							# number;

// Keywords
CLASS: C L A S S;
IDENTIFIER: [a-z] [_A-Za-z0-9]*;
TYPE: [A-Z] [A-Za-z0-9_]*;
INHERITS: I N H E R I T S;
ASSIGNMENT: '<-';
FORMALPARAMETER: IDENTIFIER ':' TYPE;
IF: I F;
THEN: T H E N;
LOOP: L O O P;
POOL: P O O L;
ELSE: E L S E;
FI: F I;
WHILE: W H I L E;
LET: L E T;
IN: I N;
NEW: N E W;
ISVOID: I S V O I D;

// Data Types
INT: I N T;
BOOL: B O O L;
STRING: S T R I N G;
TRUE: T R U E;
FALSE: F A L S E;

ADD: '+';
SUB: '-';
MUL: '*';
DIV: '/';
LT: '<';
LE: '<=';
EQ: '=';
NE: '!=';
GT: '>';
GE: '>=';
NUMBER: [0-9]+;

// Fragments
fragment A: [aA];
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment E: [eE];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment I: [iI];
fragment J: [jJ];
fragment K: [kK];
fragment L: [lL];
fragment M: [mM];
fragment N: [nN];
fragment O: [oO];
fragment P: [pP];
fragment Q: [qQ];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];
fragment X: [xX];
fragment Y: [yY];
fragment Z: [zZ];

STARTCOMMENT: '(*';
ENDCOMMENT: '*)';
COMMENT: STARTCOMMENT (.)*? ENDCOMMENT -> skip;
LINECOMMENT: '//' (~ '\n')* '\n'? -> skip;

WHITESPACE: [ \t\r\n\f\\]+ -> skip;