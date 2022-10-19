import { v4 as uuid } from 'uuid';
import { TemporalValue } from '../../Components';


export class Register {
  private reservedUntil: number = 0;
  id: string | number = uuid();
  constructor() { }

  reserveUntil(until: number) {
    this.reservedUntil = until;
  }

  isAvailable = () => this.reservedUntil === 0;

  tick = () => (this.reservedUntil === 0 ? this.reserveUntil : this.reservedUntil--);
  toString = () => `$t${this.id}`;
  setId = (id: string | number) => (this.id = id);
}

export class RegisterManager {
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
