export interface ITypeComponent {
  name: string;
  defaultValue: any;
  canBeInherited: boolean;
  allowsAssignmentOf: (type: ITypeComponent) => boolean;
  convertToType: (value: any) => any;
  allowsComparisonsTo: (type: ITypeComponent) => boolean;
  allowsNegation: boolean;
  isGeneric: boolean;
}
