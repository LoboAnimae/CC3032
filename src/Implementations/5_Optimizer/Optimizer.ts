import { TemporalValue } from "../../Components";
import { Quad } from "../4_Intermediate/Instructions";
import { RegisterManager } from "./RegisterManager";

export function Optimize(tuples: Quad[]) {
  const registerController = new RegisterManager(10);
  const newTuples: Quad[] = [];

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
        (dest !== lookingFor)
      ) {
        lastFound = i;
      }
    }
    return lastFound;
  };

  for (let i = 0; i < tuples.length; i++) {
    const currentTuple = tuples[i];
    const [_op, op1, op2, dest] = currentTuple;

    if (op1?.componentName === TemporalValue.Name) {
      const registerUsed = registerController.getPairedRegister(op1);
      if (registerUsed) {
        currentTuple[1] = registerUsed.toString();
      }
    }
    if (op2?.componentName === TemporalValue.Name) {
      const registerUsed = registerController.getPairedRegister(op2);
      if (registerUsed) {
        currentTuple[2] = registerUsed.toString();
      }
    }

    if (!dest) {
      newTuples.push(currentTuple);
      continue;
    }

    const destString = dest.id;
    if (dest?.componentName !== TemporalValue.Name) {
      newTuples.push(currentTuple);
      continue;
    }

    const pairedRegister = registerController.getPairedRegister(destString)

    // const pairedRegister = registerController.getPairedRegister(destString);
    // if (pairedRegister) {
    //   const newQuadruple = [...currentTuple];
    //   newQuadruple[3] = dest.toString().replace(temporalRegex, pairedRegister.toString());
    //   // @ts-ignore
    //   newTuples.push(newQuadruple);
    //   continue;
    // }
    // const lastUsed = lastUsage(destString, i);
    // const lastUsedReservation = lastUsed === -1 ? 0 : lastUsed - i;
    // const newPairedRegister = registerController.reserveRegister(dest, lastUsedReservation);
    // if (!newPairedRegister) {
    //   throw new Error('No registers available');
    // }
    // const newQuadruple = [...currentTuple];
    // newQuadruple[3] = dest.toString().replace(temporalRegex, newPairedRegister.toString());
    // // @ts-ignore
    // newTuples.push(newQuadruple);
    // registerController.tick();
  }
  const returnTuples = newTuples.map((tuple) => {
    const [op, op1, op2, dest] = tuple;
    return [op, op1?.toString() ?? 'null', op2?.toString() ?? 'null', dest?.toString() ?? 'null'];
  });
  return returnTuples;
}