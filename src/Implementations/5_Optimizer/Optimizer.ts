import { ConsoleErrorListener } from "antlr4ts";
import { STACK_POINTER, TemporalValue } from "../../Components";
import { Quad } from "../4_Intermediate/Instructions";
import { RegisterManager, Register } from "./RegisterManager";

export function Optimize(tuples: Quad[]) {
  const registerController = new RegisterManager(10);
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

  const reservingReg = (temp: TemporalValue, index: number, dest: TemporalValue) => {
    const lastUsed = lastUsage(temp, index);
    const lastUsedReservation = lastUsed === -1 ? 0 : lastUsed - index;
    const newPairedRegister = registerController.reserveRegister(dest, lastUsedReservation);
    return newPairedRegister
  }
    

  for (let i = 0; i < tuples.length; i++) {
    let pairs = registerController.pairs
    const currentTuple = tuples[i];
    const [_op, op1, op2, dest] = currentTuple;

    if(op1 != null && op1.toString().includes('while') && op1.toString().includes('end'))
    {
      let whileRegs = [];
      for(let j = newTuples.length - 1; j >= 0; j--)      {
        
        if(newTuples[j][3] != null && newTuples[j][3].toString().includes('while') && newTuples[j][1].toString().includes('$t') && newTuples[j][2].toString().includes('$t'))
        {
          whileRegs.push(newTuples[j][1].toString())
          whileRegs.push(newTuples[j][2].toString())
        }
        if(newTuples[j][1] != null && newTuples[j][1].toString().includes('while'))
        {
          break;
        }
      }
      for(let j = newTuples.length - 1; j >= 0; j--)
      {
        try
        {
          if(newTuples[j + 1][1] != null && newTuples[j + 1][1].toString().includes('while') && newTuples[j + 1][1].toString().includes('end'))
          {
            for(let l = 0; l < registerController.registers.length; l++)
            {
              if(registerController.registers[l].toString() == newTuples[j][1].toString())
              {
                registerController.registers[l].reserveUntil(0)
              }
            }
            registerController.pairs.pop()
            break;
          }
        }catch(e){}

        if(newTuples[j][3] != null && newTuples[j][3].toString().includes('$t'))
        {
          for(let k = 0; k < whileRegs.length; k++)
          {
            if(newTuples[j][3].toString() != whileRegs[k])
            {
              if(newTuples[j][3].toString() == registerController.pairs[registerController.pairs.length - 1][1].toString())
              {
                for(let l = 0; l < registerController.registers.length; l++)
                {
                  if(registerController.registers[l].toString() == newTuples[j][3].toString())
                  {
                    registerController.registers[l].reserveUntil(0)
                  }
                }
                registerController.pairs.pop()
              }
            }
          }
        }
      }
    }



    if(op1 == 0)
    {
      currentTuple[1] = '$zero'
    }

    try
    {
      if (temporalRegex.test(op1.toString())) {
        let registerUsed: Register | undefined = registerController.getPairedRegister(op1);
        if(!registerUsed){
          registerUsed = pairs.find((pair) => pair[0].id.startsWith(op1.id))?.[1];
        }
        if (registerUsed) {
          currentTuple[1] = registerUsed.toString();
        }
      }}
    catch(e: unknown)
    {
      currentTuple[1] = '$zero';
    }

    if (temporalRegex.test(op2?.toString() ?? '')) {
      let registerUsed: Register | undefined = registerController.getPairedRegister(op2);
      if(!registerUsed){
        registerUsed = pairs.find((pair) => pair[0].id.startsWith(op1.id))?.[1];
      }
      if (registerUsed) {
        currentTuple[2] = registerUsed.toString();
      }
    }

    if (!dest) {
      
      if(currentTuple[1] == 'return')
      {
        let spMem = 0;
        let jumpIndex: any;
        for(let j = newTuples.length - 1; j >= 0; j--)
        {
          if(newTuples[j][1].toString().includes('::'))
          {
            if(newTuples[j][1].toString().includes('j ') || newTuples[j][1].toString().includes('jal '))
            {
              continue;
            }
            else
            {
              jumpIndex = j;
              break;
            }
          }
        }
        for(let j = jumpIndex; j < newTuples.length; j++)
        {
          if(newTuples[j][1].toString().includes('$sp') && newTuples[j][3].toString().includes('$sp'))
          {
            spMem = newTuples[j][2];
            break;
          }
        }
        let regs = [];
        for(let j = jumpIndex; j < newTuples.length; j++)
        {
          if(newTuples[j][3] != null && newTuples[j][3].toString().includes('($sp)'))
          {
            regs.push([newTuples[j][1].toString(), newTuples[j][3].split('(', 1)[0]])
          }
        }

        if(spMem != 0)
        {
          for(let j = 0; j < regs.length; j++)
          {
            if(newTuples[newTuples.length - 1][1] != regs[j][0])
            {
              newTuples.push(['lw', regs[j][0], null, regs[j][1] + '($sp)'])
            }
          }
          newTuples.push(['+', '$sp', spMem, '$sp'])
          newTuples.push(['', 'jr $ra', null, null])
        }
        else
        {
          newTuples.push(currentTuple);
        }
        continue
      }
      else
      {
        newTuples.push(currentTuple);
        continue;
      }
    }

    const destString = dest.toString();
    const result = temporalRegex.exec(destString);
    if (!result) {
        const newReg = registerController.getPairedRegister(currentTuple[1]);

        if(newReg === undefined)
        {
          if(currentTuple[3].toString().includes('{') && currentTuple[3].toString().includes('}'))
          {
            let propertyStart: number = 0;
            const prop = currentTuple[3].toString().split('{', 1)[0];
            let propReg: String = '';

            for(let j = newTuples.length - 1; j >= 0; j--)
            {
              if(newTuples[j].toString().includes('Begin Property ' + prop))
              {
                propertyStart = j;
              }
            }

            for(let j = propertyStart; j < newTuples.length; j++)
            {
              if(newTuples[j][3] && newTuples[j][3].toString().includes('$t'))
              {
                propReg = newTuples[j][3];
                break;
              }
            }

            if(propertyStart == 0)
            {
              propReg = newTuples[newTuples.length - 1][1]
            }

            for(let j =  registerController.registers.length - 1; j >= 0; j--)
            {
              if(registerController.registers[j].toString() == propReg)
              {
                break;
              }
              else
              {
                registerController.registers[j].reserveUntil(0)
              }
            }

            for(let j = pairs.length - 1; j >= 0; j--)
            {
              if(registerController.pairs[j][1].toString() != propReg)
              {
                registerController.pairs.pop();
              }
              else
              {
                newTuples.push(["=", currentTuple[1], null, propReg]);
                break;
              }
            }
          }          
          else
          {
            if(currentTuple[1].toString().includes('{') && currentTuple[1].toString().includes('}'))
            {
              const unknownReg = new TemporalValue();
              unknownReg.id = currentTuple[1].toString().replace('T{', '').replace('}', '');
              const newUnknownReg: any = reservingReg(unknownReg, i, currentTuple[1]);
              let regExists;
              for(let j = newTuples.length - 1; j >= 0; j--)
              {
                if(newTuples[j][2] == null){}
                else if(newTuples[j][1].toString().includes(newUnknownReg?.toString()) || newTuples[j][2].toString().includes(newUnknownReg?.toString()) || newTuples[j][3].toString().includes(newUnknownReg?.toString()))
                {
                  regExists = true;
                  if(newTuples[j][3].toString().includes(newUnknownReg?.toString().replace(newUnknownReg.id.toString(), (Number(newUnknownReg.id) + 1).toString())))
                  {
                    currentTuple[1] = newUnknownReg?.toString().replace(newUnknownReg.id.toString(), (newUnknownReg.id + 1).toString())
                  }
                  break;
                }
              }
              if(!regExists)
              {
                let ukwnRegExists = false;
                for(let j = newTuples.length - 1; j >= 0; j--)
                {
                  if(newTuples[j][3] == null){}
                  else if(newTuples[j][1].toString().includes(newUnknownReg?.toString()) || newTuples[j][3].toString().includes(newUnknownReg?.toString()))
                  {
                    ukwnRegExists = true;
                  }
                }
                if(!ukwnRegExists)
                {
                  newTuples.push(['=', '$zero', null, newUnknownReg]);
                  currentTuple[1] = newUnknownReg;
                }
                else
                {
                  currentTuple[1] = newUnknownReg;
                }
              }
              else
              {

              }
            }
            if(currentTuple[3].toString().includes('+ -'))
            {
              let spMem;
              let jumpIndex: any;
              for(let j = newTuples.length - 1; j >= 0; j--)
              {
                if(newTuples[j][1].toString().includes('::'))
                {
                  jumpIndex = j;
                  break;
                }
              }
              for(let j = jumpIndex; j < newTuples.length; j++)
              {
                if(newTuples[j][1].toString().includes('$sp') && newTuples[j][3].toString().includes('$sp'))
                {
                  spMem = newTuples[j][2];
                  break;
                }
              }
              if(Math.abs(currentTuple[3].offset) > spMem)
              {
                currentTuple[3].offset += spMem
              }
              const allocMem = spMem + currentTuple[3].offset;
              currentTuple[3] = allocMem.toString() + '($sp)';
            }
            if(currentTuple[1].toString() == '$ra')
            {
              currentTuple[3] = currentTuple[3].offset.toString() + '($sp)'
            }
            newTuples.push(currentTuple);
          }
          continue;
        }
        else
        {
          currentTuple[1] = newReg.toString();
          newTuples.push(currentTuple);
          continue;
        }
        
  
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
    
    const newPairedRegister = reservingReg(foundTemp, i, dest);

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
}