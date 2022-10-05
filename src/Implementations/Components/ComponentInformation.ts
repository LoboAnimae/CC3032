const ComponentInformation = {
  type: {
    Integer: {
      name: 'Int',
    },
    Bool: {
      name: 'Bool',
    },
    String: {
      name: 'String',
    },
    IO: {
      name: 'IO',
    },
    Object: {
      name: 'Object',
    },
  },
  components: {
    BasicInfo: {
      name: 'BasicInformation',
      type: 'BasicInformation',
    },
    Table: {
      name: 'Table',
      type: 'Table',
    },
    Type: {
      name: 'Type',
      type: 'Type',
    },
    ValueHolder: {
      name: 'ValueHolder',
      type: 'ValueHolder',
    },
    Composition: {
      name: 'CompositionComponent',
      type: 'CompositionComponent',
    },
    EmptyComponent: {
      name: 'EmptyComponent',
      type: 'CompositionComponent',
    },
    Positioning: {
      name: 'Positioning',
      type: 'Positioning',
    },
    Class: {
      name: 'Class',
      type: 'Class',
    },
    Quadruplet: {
      name: 'Quadruplet',
      type: 'QuadrupletComponent',
      element: 'QuadrupletElement',
    },
  },
};

export default ComponentInformation;
