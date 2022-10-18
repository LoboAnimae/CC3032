import { CompositionComponent } from '.';

export class TemporalValue extends CompositionComponent {
  static Name = 'TemporalValue';
  static Type = 'TemporalValue';
  constructor() {
    super();
    this.componentName = TemporalValue.Name;
    this.componentType = TemporalValue.Type;
  }
  clone = () => new TemporalValue();
  toString = () => `T{${this.id.substring(0, 3)}}`;
}

export abstract class Registry extends TemporalValue {
  static Name = 'Registry';
  static Type = 'Registry';
  abstract register: string;
  constructor() {
    super();
    this.componentName = Registry.Name;
    this.componentType = Registry.Type;
  }
  toString = () => this.register;
}

export class V0 extends Registry {
  register = '$v0';

  clone = (): V0 => {
    return new V0();
  };
}

export class FUNCTION_PARAMETER_1 extends Registry {
  register = '$a0';

  clone = (): FUNCTION_PARAMETER_1 => {
    return new FUNCTION_PARAMETER_1();
  };
}

export class FUNCTION_PARAMETER_2 extends Registry {
  register = '$a1';

  clone = (): FUNCTION_PARAMETER_2 => {
    return new FUNCTION_PARAMETER_2();
  };
}

export class OBJECT_POINTER extends Registry {
  register = '$a2';

  clone = (): OBJECT_POINTER => {
    return new OBJECT_POINTER();
  };
}

export class STACK_POINTER extends Registry {
  register = '$sp';
  offset: number;
  constructor(offset: number = 0) {
    super();
    this.offset = offset;
  }

  clone = (): STACK_POINTER => {
    return new STACK_POINTER(this.offset);
  };

  toString = () => {
    if (this.offset) {
      return `${this.register} + ${this.offset}`;
    }
    return this.register;
  };
}

export class JUMP_LINK_REGISTER extends Registry {
  register = '$ra';

  clone = (): JUMP_LINK_REGISTER => {
    return new JUMP_LINK_REGISTER();
  };
}

export class JUMP_WITH_LINK extends Registry {
  register = 'jal';

  clone = (): JUMP_WITH_LINK => {
    return new JUMP_WITH_LINK();
  };
}

export class JUMP_BACK extends Registry {
  register = 'jr';

  clone = (): JUMP_BACK => {
    return new JUMP_BACK();
  };
}

abstract class SystemCall extends TemporalValue {
  static Name = 'SystemCall';
  static Type = 'SystemCall';
  abstract callValue: number;
  constructor() {
    super();
    this.componentName = SystemCall.Name;
    this.componentType = SystemCall.Type;
  }
  toString = () => this.callValue.toString();
}

export class PRINT_INT extends SystemCall {
  callValue = 1;

  clone = (): PRINT_INT => {
    return new PRINT_INT();
  };
}

export class PRINT_STRING extends SystemCall {
  callValue = 4;

  clone = (): PRINT_STRING => {
    return new PRINT_STRING();
  };
}

export class READ_INT extends SystemCall {
  callValue = 5;

  clone = (): READ_INT => {
    return new READ_INT();
  };
}

export class READ_STRING extends SystemCall {
  callValue = 8;

  clone = (): READ_STRING => {
    return new READ_STRING();
  };
}

export class ALLOCATE extends SystemCall {
  callValue = 9;

  clone = (): ALLOCATE => {
    return new ALLOCATE();
  };
}

export class EXIT extends SystemCall {
  callValue = 10;

  clone = (): EXIT => {
    return new EXIT();
  };
}
