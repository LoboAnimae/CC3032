import { v4 as uuid } from 'uuid';

export enum CompositionErrors {
  DUPLICATE_COMPONENT = 'Duplicate component',
}

abstract class CompositionComponent {
  static Name = 'CompositionComponent';
  static Type = 'CompositionComponent';
  id: string;
  unique: boolean;
  /** Managed by members */
  componentName: string;
  /** Managed by primitives*/
  componentType: string;
  /**
   * The children of a component. They are managed by the component and (should not) have duplicates.
   */
  children: CompositionComponent[];
  constructor() {
    this.id = uuid();
    this.componentName = CompositionComponent.Name;
    this.componentType = CompositionComponent.Type;
    this.unique = true;
    this.children = [];
  }

  addComponent(...newComponents: (CompositionComponent | undefined | null)[]) {
    for (const newComponent of newComponents) {
      if (!newComponent) continue;
      if (newComponent.unique) {
        const duplicateElement = this.getComponent(
          { componentName: newComponent.componentName, componentType: newComponent.componentType },
          { currentScope: true },
        );
        if (duplicateElement) {
          throw new Error(CompositionErrors.DUPLICATE_COMPONENT);
        }
      }
      this.children.push(newComponent);
    }
    return this;
  }

  getComponent<T extends CompositionComponent>(
    params: { componentName?: string; componentType?: string; id?: string },
    options?: { currentScope?: boolean },
  ): T | null {
    return this.getComponents<T>(params, options)[0] as T;
  }

  getComponents<T extends CompositionComponent>(
    params: { componentName?: string; componentType?: string; id?: string },
    options?: { currentScope?: boolean },
  ): T[] {
    const byPropertyRaw = Object.keys(params).map((key) => ({ key, value: params[key as keyof typeof params] }));
    const filters: { key: string; value: any }[] = byPropertyRaw.filter((filtering) => !!filtering.value);

    const allFound: CompositionComponent[] = [];
    const allComponents = [this, ...this.children];
    for (const filter of filters) {
      // @ts-ignore
      const found = allComponents.filter((component) => component[filter.key] === filter.value);
      allFound.push(...found);
    }
    if (options?.currentScope) {
      return allFound as T[];
    }
    for (const child of this.children) {
      const found = child.getComponents<T>(params, { currentScope: false });
      if (!found) continue;
      allFound.push(...found);
    }

    return allFound as T[];
  }

  removeComponent(options?: { id?: string; name?: string; type?: string }): boolean {
    if (options?.id) {
      this.children = this.children.filter((component) => component.id !== options.id);
      return true;
    } else if (options?.name) {
      this.children = this.children.filter((component) => component.componentName !== options.name);
      return true;
    } else if (options?.type) {
      this.children = this.children.filter((component) => component.componentType !== options.type);
      return true;
    }
    return false;
  }

  /**
   * Converts a component into a T type. Careful, this does not protect against type errors.
   * @param asType
   * @returns
   */
  as<T>(asType: any): T {
    return this as unknown as T;
  }

  abstract clone(): CompositionComponent;
  copy<T extends CompositionComponent>(): T {
    const returnValue = this.clone();
    for (const component of this.children) {
      const elementExists = !!returnValue.getComponent({ componentType: component.componentType });
      if (elementExists) continue;
      returnValue.addComponent(component.copy());
    }
    return returnValue as T;
  }

  toString(): string {
    return `<Component> ${this.componentName}`;
  }
}

export default CompositionComponent;
