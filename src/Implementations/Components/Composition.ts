import { v4 as uuid } from "uuid";

export interface CompositionParams {
  componentName: string;
}

abstract class CompositionComponent {
  id: string;
  componentName: string;
  children: CompositionComponent[] = [];
  constructor(options?: Partial<CompositionParams>) {
    this.id = uuid();
    this.componentName = options?.componentName || this.id;
  }
  addComponent(...newComponents: (CompositionComponent | undefined | null)[]) {
    for (const newComponent of newComponents) {
      if (!newComponent) continue;
        newComponent.setMethods(this);
        this.children.push(newComponent);
    }
    return this;
  }

  getComponent<T>(instance: new () => T ): T | null {
      return (this instanceof instance ? this : this.children.find((component) => component instanceof instance)) as T ?? null;
  }
  removeComponent(options?: { id?: string; name?: string }) {
    if (options?.id) {
      this.children = this.children.filter((component) => component.id !== options.id);
      return true;
    } else if (options?.name) {
      this.children = this.children.filter((component) => component.componentName !== options.name);
      return true;
    }
    return false;
  }

  as<T>(asType: new(params?: any) => T): T  {
    return this as unknown as T;
  }

  abstract copy(): CompositionComponent;
  abstract setMethods(into: CompositionComponent): void;
  abstract configure(into: any): void;
}

export default CompositionComponent;
