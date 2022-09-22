import { v4 as uuid } from 'uuid';

export interface CompositionParams {
    componentName: string;
}


export type SupportedComponents = 'BasicInformation' | 'Positioning' | 'ValueHolder' | 'Type' | 'Table';


abstract class Component {
    id: string;
    componentName: string;
    children: Component[] = [];
    constructor(options?: Partial<CompositionParams>) {
        this.id = uuid();
        this.componentName = options?.componentName || this.id;
    }
    addComponent(newComponent: Component) {
        if (this.getComponent({ name: newComponent.componentName as SupportedComponents }) === null) {
            newComponent.setMethods(this);
            this.children.push(newComponent);
        }
        return this;
    }

    getComponent<T>(options?: { id?: string, name?: SupportedComponents; }): T | null {
        if (options?.id) {
            return this.children.find((component) => component.id === options.id) as unknown as T ?? null;
        }
        if (options?.name) {
            return this.children.find((component) => component.componentName === options.name) as unknown as T ?? null;
        }
        return null;
    }
    removeComponent(options?: { id?: string, name?: string; }) {
        if (options?.id) {
            this.children = this.children.filter((component) => component.id !== options.id);
            return true;
        } else if (options?.name) {
            this.children = this.children.filter((component) => component.componentName !== options.name);
            return true;
        }
        return false;
    }

    as<T>(): T | undefined {
        return this as unknown as T;
    }
    abstract setMethods(into: Component): void;
}

export default Component;