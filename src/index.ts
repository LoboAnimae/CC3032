import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import express from 'express';
import { yaplLexer } from './antlr/yaplLexer';
import { yaplParser } from './antlr/yaplParser';
import path from 'path';
import fs from 'fs';
import { YaplVisitor } from './yaplVisitor';
import { extractTableComponent } from './Implementations/Components/Table';
import { MemoryVisitor } from './Implementations/DataStructures/Memory';
import { Quad } from './Implementations/DataStructures/MemoryVisitors/Instructions/Quadruple';
import { v4 as uuid } from 'uuid';
import { TemporalValue } from './Implementations/DataStructures/MemoryVisitors/TemporaryValues';
class Register {
  private reservedUntil: number = 0;
  id: string | number = uuid();
  constructor() {}

  reserveUntil(until: number) {
    this.reservedUntil = until;
  }

  isAvailable = () => this.reservedUntil === 0;

  tick = () => (this.reservedUntil === 0 ? this.reserveUntil : this.reservedUntil--);
  toString = () => `$t${this.id}`;
  setId = (id: string | number) => (this.id = id);
}

class RegisterManager {
  registers: Register[];
  constructor(registerNumber: number) {
    this.registers = new Array(registerNumber);
    for (let i = 0; i < registerNumber; i++) {
      this.registers[i] = new Register();
    }
    this.registers.forEach((register, index) => register.setId(index));
  }

  getRegister(): Register | null {
    const register = this.registers.find((value) => value.isAvailable());
    if (!register) return null;
    return register;
  }

  tick() {
    this.registers.forEach((register) => register.tick());
    this.pairs = this.pairs.filter((pair) => !pair[1].isAvailable());
  }

  pairs: [TemporalValue, Register][] = [];

  reserveRegister(usingRegister: TemporalValue, forTicks: number) {
    const register = this.getRegister();
    if (!register) return null;
    register.reserveUntil(forTicks);
    this.pairs.push([usingRegister, register]);
    return register;
  }

  getPairedRegister(temporal: TemporalValue) {
    return this.pairs.find((pair) => pair[0].id.startsWith(temporal.id))?.[1];
  }
}

const optimize = (tuples: Quad[]) => {
  const registerController = new RegisterManager(100);
  const newTuples: Quad[] = [];
  const temporalRegex = /T\{.{3}\}/;

  /**
   *
   * @param lookingFor What we are trying to find
   * @param fromIndex From what index
   * @returns The index of next usage or -1 if not used afterwards
   */
  const lastUsage = (lookingFor: TemporalValue, fromIndex: number) => {
    let lastFound = -1;
    for (let i = fromIndex + 1; i < tuples.length; i++) {
      const tuple = tuples[i];
      const [_op, op1, op2, dest] = tuple;

      if (
        op1 === lookingFor ||
        op2 === lookingFor ||
        (dest !== lookingFor && temporalRegex.exec(dest?.toString() ?? ''))
      ) {
        lastFound = i;
      }
    }
    return lastFound;
  };

  for (let i = 0; i < tuples.length; i++) {
    const currentTuple = tuples[i];
    const [_op, op1, op2, dest] = currentTuple;

    if (temporalRegex.test(op1.toString())) {
      const registerUsed = registerController.getPairedRegister(op1);
      if (registerUsed) {
        currentTuple[1] = registerUsed.toString();
      }
    }
    if (temporalRegex.test(op2?.toString() ?? '')) {
      const registerUsed = registerController.getPairedRegister(op2);
      if (registerUsed) {
        currentTuple[2] = registerUsed.toString();
      }
    }

    if (!dest) {
      newTuples.push(currentTuple);
      continue;
    }

    const destString = dest.toString();
    const result = temporalRegex.exec(destString);
    if (!result) {
      newTuples.push(currentTuple);
      continue;
    }
    const foundDest = result[0];
    const foundTemp = new TemporalValue();
    foundTemp.id = foundDest.replace('T{', '').replace('}', '');
    const pairedRegister = registerController.getPairedRegister(foundTemp);
    if (pairedRegister) {
      const newQuadruple = [...currentTuple];
      newQuadruple[3] = dest.toString().replace(temporalRegex, pairedRegister.toString());
      // @ts-ignore
      newTuples.push(newQuadruple);
      continue;
    }
    const lastUsed = lastUsage(foundTemp, i);
    const lastUsedReservation = lastUsed === -1 ? 0 : lastUsed - i;
    const newPairedRegister = registerController.reserveRegister(dest, lastUsedReservation);
    if (!newPairedRegister) {
      throw new Error('No registers available');
    }
    const newQuadruple = [...currentTuple];
    newQuadruple[3] = dest.toString().replace(temporalRegex, newPairedRegister.toString());
    // @ts-ignore
    newTuples.push(newQuadruple);
    registerController.tick();
  }
  const returnTuples = newTuples.map((tuple) => {
    const [op, op1, op2, dest] = tuple;
    return [op, op1?.toString() ?? 'null', op2?.toString() ?? 'null', dest?.toString() ?? 'null'];
  });
  return returnTuples;
};

function main(input: string): IResult {
  let inputStream = new ANTLRInputStream(input);
  let lexer = new yaplLexer(inputStream);
  let tokenStream = new CommonTokenStream(lexer);
  let parser = new yaplParser(tokenStream);

  let tree = parser.program();

  const visitor = new YaplVisitor();
  // Semantic
  visitor.visit(tree);
  const symbolsTable = visitor.symbolsTable;
  const errors = visitor.errorComponent().getAll();
  if (errors.length) {
    console.log('Errors found, aborting');
    return {
      errors: errors.map((e) => `[${e.line}: ${e.column}]${e.message}`),
      quadruples: '',
      tuples: [],
    };
  }
  // Memory
  const mainClass = symbolsTable.get('Main')!;
  if (!mainClass) {
    console.log('Main method not found, aborting');
    return {
      errors: ['Main method not found'],
      quadruples: '',
      tuples: [],
    };
  }
  const mainTable = extractTableComponent(mainClass)!;
  const mainMethod = mainTable.get('main')!;
  if (!mainMethod) {
    return {
      errors: ['Main method not found'],
      quadruples: '',
      tuples: [],
    };
  }

  const memory = new MemoryVisitor(symbolsTable, visitor.mainBranch!);
  memory.instantiate();

  const allScopes = Object.keys(memory.methods);

  const optimizedTuples = [];
  for (const scope of allScopes) {
    const allQuads = memory.methods[scope].map((t) => t.toTuple());
    optimizedTuples.push(...optimize(allQuads));
  }
  const quadruples = memory.getQuadruples();
  return {
    errors: errors.map((e) => `[${e.line}: ${e.column}]${e.message}`),
    quadruples,
    tuples: optimizedTuples.map((t) => t.toString()),
  };
}

const pathToFileURL = path.join(__dirname, '..', 'example.txt');
const contents = fs.readFileSync(pathToFileURL, 'utf8');

main(contents);

// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get('/', (req, res) => {
//   res.sendStatus(200);
// });

interface IResult {
  quadruples: string;
  errors: string[];
  tuples: string[];
}
// app.post('/', (req, res) => {
//   const { program } = req.body;
//   if (!program) {
//     return res.sendStatus(400);
//   }
//   const parsed = JSON.parse(program);
//   const result = main(parsed);
//   res.json(result);
// });

// app.listen(port);
