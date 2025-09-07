export interface OntologyClass {
  id: string;
  name: string;
  description?: string;
  properties: string[];
  parentClass?: string;
  type: 'tbox' | 'abox';
  position: { x: number; y: number };
}

export interface OntologyProperty {
  id: string;
  name: string;
  description?: string;
  domain: string;
  range: string;
  type: 'tbox' | 'abox';
}

export interface OntologyInstance {
  id: string;
  name: string;
  classId: string;
  properties: Record<string, any>;
  type: 'abox';
  position: { x: number; y: number };
}

export interface OntologyRelation {
  id: string;
  sourceId: string;
  targetId: string;
  propertyId: string;
  type: 'tbox' | 'abox';
}

export interface Workspace {
  id: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  classes?: OntologyClass[];
  properties?: OntologyProperty[];
  instances?: OntologyInstance[];
  relations?: OntologyRelation[];
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'class' | 'instance';
  boxType: 'tbox' | 'abox';
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'tbox' | 'abox';
}

export interface UploadPreview {
  classes: OntologyClass[];
  properties: OntologyProperty[];
  instances: OntologyInstance[];
  relations: OntologyRelation[];
}

export interface ApprovedSections {
  classes: boolean;
  properties: boolean;
  instances: boolean;
}