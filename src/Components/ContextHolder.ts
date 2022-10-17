import { ExpressionContext } from 'antlr/yaplParser';
import {CompositionComponent} from '.';

export function extractContext<T extends ExpressionContext>(inComponent?: CompositionComponent | null) {
  if (!inComponent) return null;
  return inComponent.getComponent<ContextHolder<T>>({ componentType: ContextHolder.Type });
}

export class ContextHolder<T extends ExpressionContext> extends CompositionComponent {
  context: T | null;
  static Name = 'ContextHolder';
  static Type = 'ContextHolder';
  constructor(context?: T | null) {
    super();
    this.context = context ?? null;
    this.componentName = ContextHolder.Name;
    this.componentType = ContextHolder.Type;
  }

  clone(): CompositionComponent {
    return new ContextHolder(this.context);
  }

  getContext = () => this.context;
  setContext = (context: T) => {
    this.context = context;
  };
}
