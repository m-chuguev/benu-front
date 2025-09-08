import { TBox, OntologyClass, OntologyProperty, OntologyInstance, OntologyRelation } from '../types/ontology';

export const mockWorkspaces: TBox[] = [
  {
    id: '1',
    label: 'Academic Knowledge Graph',
    description: 'University course and faculty management ontology',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    classes: [
      {
        id: 'c1',
        name: 'Person',
        description: 'Base class for all persons',
        properties: ['p1', 'p2'],
        type: 'tbox',
        position: { x: 100, y: 100 }
      },
      {
        id: 'c2',
        name: 'Professor',
        description: 'Faculty member who teaches courses',
        properties: ['p3', 'p4'],
        parentClass: 'c1',
        type: 'tbox',
        position: { x: 200, y: 200 }
      },
      {
        id: 'c3',
        name: 'Student',
        description: 'Person enrolled in courses',
        properties: ['p5'],
        parentClass: 'c1',
        type: 'tbox',
        position: { x: 300, y: 200 }
      },
      {
        id: 'c4',
        name: 'Course',
        description: 'Educational course offering',
        properties: ['p6', 'p7'],
        type: 'tbox',
        position: { x: 400, y: 100 }
      }
    ],
    properties: [
      {
        id: 'p1',
        name: 'hasName',
        description: 'The name of a person',
        domain: 'c1',
        range: 'string',
        type: 'tbox'
      },
      {
        id: 'p2',
        name: 'hasEmail',
        description: 'Email address',
        domain: 'c1',
        range: 'string',
        type: 'tbox'
      },
      {
        id: 'p3',
        name: 'hasDepartment',
        description: 'Academic department',
        domain: 'c2',
        range: 'string',
        type: 'tbox'
      },
      {
        id: 'p4',
        name: 'teaches',
        description: 'Course taught by professor',
        domain: 'c2',
        range: 'c4',
        type: 'tbox'
      },
      {
        id: 'p5',
        name: 'enrolledIn',
        description: 'Course student is enrolled in',
        domain: 'c3',
        range: 'c4',
        type: 'tbox'
      },
      {
        id: 'p6',
        name: 'courseCode',
        description: 'Unique course identifier',
        domain: 'c4',
        range: 'string',
        type: 'tbox'
      },
      {
        id: 'p7',
        name: 'credits',
        description: 'Credit hours for course',
        domain: 'c4',
        range: 'number',
        type: 'tbox'
      }
    ],
    instances: [
      {
        id: 'i1',
        name: 'Dr. Jane Smith',
        classId: 'c2',
        properties: {
          hasName: 'Jane Smith',
          hasEmail: 'jane.smith@university.edu',
          hasDepartment: 'Computer Science'
        },
        type: 'abox',
        position: { x: 150, y: 300 }
      },
      {
        id: 'i2',
        name: 'John Doe',
        classId: 'c3',
        properties: {
          hasName: 'John Doe',
          hasEmail: 'john.doe@student.university.edu'
        },
        type: 'abox',
        position: { x: 350, y: 300 }
      },
      {
        id: 'i3',
        name: 'CS 101',
        classId: 'c4',
        properties: {
          courseCode: 'CS 101',
          credits: 3
        },
        type: 'abox',
        position: { x: 450, y: 250 }
      }
    ],
    relations: [
      {
        id: 'r1',
        sourceId: 'c2',
        targetId: 'c1',
        propertyId: 'inheritance',
        type: 'tbox'
      },
      {
        id: 'r2',
        sourceId: 'c3',
        targetId: 'c1',
        propertyId: 'inheritance',
        type: 'tbox'
      },
      {
        id: 'r3',
        sourceId: 'i1',
        targetId: 'i3',
        propertyId: 'p4',
        type: 'abox'
      },
      {
        id: 'r4',
        sourceId: 'i2',
        targetId: 'i3',
        propertyId: 'p5',
        type: 'abox'
      }
    ]
  },
  {
    id: '2',
    label: 'Product Catalog',
    description: 'E-commerce product classification system',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    classes: [],
    properties: [],
    instances: [],
    relations: []
  }
];