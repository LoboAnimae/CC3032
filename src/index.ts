import { extractTableComponent } from './Components';
import fs from 'fs';
import { Semantic } from './Implementations/3_Semantic';
import { MemoryVisitor } from './Implementations/4_Intermediate/visitor';
import { Optimize } from './Implementations/5_Optimizer/Optimizer';
import { IError } from './Interfaces';
import path from 'path';
import Lexer from './Implementations/1_Lexic/LexicAnalizer';
import Parser from './Implementations/2_Syntactic/SyntacticAnalizer';
import { Color } from './Misc';

function main(input: string): IResult {
  /*
   * Lexer phase
   */
  const lexer = Lexer(input);
  /*
   * Parser phase
   */
  const parser = Parser(lexer);
  /*
   * Semantic phase
   */
  const { errors, symbolsTable, mainBranch } = Semantic(parser.tree);

  if (errors) {
    const output = errors.map((error) => `${Color.colorize(`${error.line}:${error.column}`, Color.CYAN)}\t${error.message}`).join('\n')
    console.log(output)
    return { errors };
  }
  if (!symbolsTable) {
    return { errors: [{ message: 'No symbols table found', line: -1, column: -1 }] };
  } else if (!mainBranch) {
    return { errors: [{ message: 'No main branch found', line: -1, column: -1 }] };
  }
  const mainClass = symbolsTable.get('Main')!;
  if (!mainClass) {
    console.log('Main method not found, aborting');
    return { errors: [{ message: 'Main class not found', line: -1, column: -1 }] };
  }
  const mainTable = extractTableComponent(mainClass)!;
  const mainMethod = mainTable.get('main')!;
  if (!mainMethod) {
    return { errors: [{ message: 'Main method not found', line: -1, column: -1 }] };
  }

  /*
   * Intermediate Code Phase
   */
  const memory = new MemoryVisitor(symbolsTable, mainBranch!);
  memory.instantiate();

  const allScopes = Object.keys(memory.methods);

  const optimizedTuples = [];
  for (const scope of allScopes) {
    const allQuads = memory.methods[scope].map((t) => t.toTuple());
    optimizedTuples.push(...Optimize(allQuads));
  }

  for (let i = 0; i < optimizedTuples.length; i++)
  {
    let [op, op1, op2, dest] = optimizedTuples[i];

    if(op1.includes('Begin Property') || op1.includes('End Property'))
    {
      op = '#'
    }

    if(op == null || op == 'null')
    {
      op = ''
    }
    if(op1 == null || op1 == 'null')
    {
      op1 = ''
      
    }
    if(op2 == null || op2 == 'null')
    {
      if(op1 == '$zero')
      {
        op2 = '0'
      }
      else
      {
        op2 = ''
      }
    }
    if(dest == null || dest == 'null')
    {
      dest = ''
    }
    let line = '';
    if(op1 == '$zero' && op2 == '0')
    {
      op1 = op1 + ','
    }
    if(op == 'add')
    {
      if(dest.includes('v')&& (op2 == 'null' || op2 == null || op2 == ''))
      {
        op = 'li'
      }
      if(dest.includes('a') && (op2 == 'null' || op2 == null || op2 == ''))
      {
        op = 'li'
      }
    }
    if(dest.includes('($t') && dest.includes(')'))
    {
      let dest_spl = dest.split(' + ')
      let memsp = dest_spl[1].split(')')[0]
      dest = memsp + dest_spl[0] + ')'
    }

    if(dest.includes('($sp)'))
    {
      dest = dest.replace(',', '')
      op1 = op1 + ', '
      line = op + ' '  + ' ' + op1 + ' ' + op2 + dest
    }
    else
    {
      if(op == 'add')
      {
        if(op1.indexOf('$') == -1)
        {
          op = 'addi'
        }
      }
      line = op + ' ' + dest + ' ' + op1 + ' ' + op2
    }
    console.log(line)
    //console.log(optimizedTuples[i])
  }
  return { errors: [] };
}

const pathToFileURL = path.join(__dirname, '..', 'example.txt');
const contents = fs.readFileSync(pathToFileURL, 'utf8');

main(contents);

// const app = express();
// const port = 3001;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get('/', (req, res) => {
//   res.sendStatus(200);
// });

interface IResult {
  errors: IError[];
}
// app.post('/', (req, res) => {
//   console.log('Received request');
//   const { program } = req.body;
//   if (!program) {
//     return res.sendStatus(400);
//   }
//   const parsed = JSON.parse(program);
//   const result = main(parsed);
//   res.json(result);
// });

// app.listen(port, () => {
//   console.log('Running on port', port);
// });
