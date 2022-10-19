import { Primitive } from ".";
import { CompositionComponent, EmptyComponent } from "../../Components";

export class ErrorType extends Primitive {
    static Name = 'EmptyComponent';
    static Type = CompositionComponent.Type;
    defaultValue: any;
    constructor() {
        super({name: 'ERROR_TYPE'});
        this.componentName = EmptyComponent.Name;
    }
    allowsAssignmentOf = (_incomingType?: CompositionComponent | undefined) => false;
    allowsComparisonTo = (_incomingType?: CompositionComponent | undefined) => false;
    coherseType = (_incomingType?: CompositionComponent | undefined, value?: any) => false;
    clone(): CompositionComponent {
        throw new Error("Method not implemented.");
    }

}