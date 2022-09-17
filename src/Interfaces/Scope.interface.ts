export enum ScopeType {
  Class,
  Method,
}

export interface IScopeComponent {
  name: string;
  scopeType: ScopeType;
}
