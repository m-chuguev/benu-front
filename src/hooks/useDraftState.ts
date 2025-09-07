import { useState, useCallback, useRef } from 'react';
import { TBox, OntologyClass, OntologyInstance, OntologyProperty, OntologyRelation } from '../types/ontology';

export interface DraftAction {
  id: string;
  type: 'add' | 'edit' | 'delete' | 'move' | 'addRelation' | 'editRelation' | 'deleteRelation';
  timestamp: Date;
  nodeId?: string;
  edgeId?: string;
  data?: any;
  previousData?: any;
}

export interface DraftState {
  classes: OntologyClass[];
  instances: OntologyInstance[];
  properties: OntologyProperty[];
  relations: OntologyRelation[];
  modifiedNodes: Set<string>;
  modifiedEdges: Set<string>;
  actions: DraftAction[];
}

export function useDraftState(initialWorkspace: TBox) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [draft, setDraft] = useState<DraftState>({
    classes: [...initialWorkspace?.classes ?? []],
    instances: [...initialWorkspace?.instances ?? []],
    properties: [...initialWorkspace?.properties ?? []],
    relations: [...initialWorkspace?.relations ?? []],
    modifiedNodes: new Set(),
    modifiedEdges: new Set(),
    actions: []
  });

  const actionIdRef = useRef(0);

  const createAction = useCallback((
    type: DraftAction['type'],
    nodeId?: string,
    edgeId?: string,
    data?: any,
    previousData?: any
  ): DraftAction => ({
    id: `action-${++actionIdRef.current}`,
    type,
    timestamp: new Date(),
    nodeId,
    edgeId,
    data,
    previousData
  }), []);

  const enterEditMode = useCallback(() => {
    setIsEditMode(true);
    // Reset draft to current workspace state
    setDraft({
      classes: [...initialWorkspace?.classes ?? []],
      instances: [...initialWorkspace?.instances ?? []],
      properties: [...initialWorkspace?.properties ?? []],
      relations: [...initialWorkspace?.relations ?? []],
      modifiedNodes: new Set(),
      modifiedEdges: new Set(),
      actions: []
    });
  }, [initialWorkspace]);

  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
    setDraft({
      classes: [...initialWorkspace?.classes ??[]],
      instances: [...initialWorkspace?.instances ??[]],
      properties: [...initialWorkspace?.properties ?? []],
      relations: [...initialWorkspace?.relations ?? []],
      modifiedNodes: new Set(),
      modifiedEdges: new Set(),
      actions: []
    });
  }, [initialWorkspace]);

  const updateNode = useCallback((nodeId: string, updates: Partial<OntologyClass | OntologyInstance>) => {
    if (!isEditMode) return;

    setDraft(prev => {
      const classIndex = prev.classes.findIndex(c => c.id === nodeId);
      const instanceIndex = prev.instances.findIndex(i => i.id === nodeId);
      
      let previousData: any = null;
      let newClasses = [...prev?.classes ?? []];
      let newInstances = [...prev?.instances ?? []];

      if (classIndex !== -1) {
        previousData = { ...prev.classes[classIndex] };
        newClasses[classIndex] = { ...prev.classes[classIndex], ...updates };
      } else if (instanceIndex !== -1) {
        previousData = { ...prev.instances[instanceIndex] };
        newInstances[instanceIndex] = { ...prev.instances[instanceIndex], ...updates };
      }

      const action = createAction('edit', nodeId, undefined, updates, previousData);
      const newModifiedNodes = new Set(prev.modifiedNodes);
      newModifiedNodes.add(nodeId);

      return {
        ...prev,
        classes: newClasses,
        instances: newInstances,
        modifiedNodes: newModifiedNodes,
        actions: [...prev.actions, action]
      };
    });
  }, [isEditMode, createAction]);

  const moveNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
    if (!isEditMode) return;

    setDraft(prev => {
      const classIndex = prev.classes.findIndex(c => c.id === nodeId);
      const instanceIndex = prev.instances.findIndex(i => i.id === nodeId);
      
      let previousPosition: { x: number; y: number } | null = null;
      let newClasses = [...prev.classes ?? []];
      let newInstances = [...prev.instances ?? []];

      if (classIndex !== -1) {
        previousPosition = { ...prev.classes[classIndex].position };
        newClasses[classIndex] = { ...prev.classes[classIndex], position };
      } else if (instanceIndex !== -1) {
        previousPosition = { ...prev.instances[instanceIndex].position };
        newInstances[instanceIndex] = { ...prev.instances[instanceIndex], position };
      }

      const action = createAction('move', nodeId, undefined, position, previousPosition);
      const newModifiedNodes = new Set(prev.modifiedNodes);
      newModifiedNodes.add(nodeId);

      return {
        ...prev,
        classes: newClasses,
        instances: newInstances,
        modifiedNodes: newModifiedNodes,
        actions: [...prev.actions, action]
      };
    });
  }, [isEditMode, createAction]);

  const addNode = useCallback((node: OntologyClass | OntologyInstance) => {
    if (!isEditMode) return;

    setDraft(prev => {
      const action = createAction('add', node.id, undefined, node);
      const newModifiedNodes = new Set(prev.modifiedNodes);
      newModifiedNodes.add(node.id);

      if ('properties' in node && Array.isArray(node.properties)) {
        // It's a class
        return {
          ...prev,
          classes: [...prev.classes, node as OntologyClass],
          modifiedNodes: newModifiedNodes,
          actions: [...prev.actions, action]
        };
      } else {
        // It's an instance
        return {
          ...prev,
          instances: [...prev.instances, node as OntologyInstance],
          modifiedNodes: newModifiedNodes,
          actions: [...prev.actions, action]
        };
      }
    });
  }, [isEditMode, createAction]);

  const deleteNode = useCallback((nodeId: string) => {
    if (!isEditMode) return;

    setDraft(prev => {
      const classIndex = prev.classes.findIndex(c => c.id === nodeId);
      const instanceIndex = prev.instances.findIndex(i => i.id === nodeId);
      
      let deletedNode: any = null;
      let newClasses = [...prev.classes ?? []];
      let newInstances = [...prev.instances ?? []];

      if (classIndex !== -1) {
        deletedNode = prev.classes[classIndex];
        newClasses.splice(classIndex, 1);
      } else if (instanceIndex !== -1) {
        deletedNode = prev.instances[instanceIndex];
        newInstances.splice(instanceIndex, 1);
      }

      // Also remove related relations
      const newRelations = prev.relations.filter(r => r.sourceId !== nodeId && r.targetId !== nodeId);

      const action = createAction('delete', nodeId, undefined, null, deletedNode);
      const newModifiedNodes = new Set(prev.modifiedNodes);
      newModifiedNodes.delete(nodeId);

      return {
        ...prev,
        classes: newClasses,
        instances: newInstances,
        relations: newRelations,
        modifiedNodes: newModifiedNodes,
        actions: [...prev.actions, action]
      };
    });
  }, [isEditMode, createAction]);

  const updateRelation = useCallback((relationId: string, updates: Partial<OntologyRelation>) => {
    if (!isEditMode) return;

    setDraft(prev => {
      const relationIndex = prev.relations.findIndex(r => r.id === relationId);
      if (relationIndex === -1) return prev;

      const previousData = { ...prev.relations[relationIndex] };
      const newRelations = [...prev.relations];
      newRelations[relationIndex] = { ...prev.relations[relationIndex], ...updates };

      const action = createAction('editRelation', undefined, relationId, updates, previousData);
      const newModifiedEdges = new Set(prev.modifiedEdges);
      newModifiedEdges.add(relationId);

      return {
        ...prev,
        relations: newRelations,
        modifiedEdges: newModifiedEdges,
        actions: [...prev.actions, action]
      };
    });
  }, [isEditMode, createAction]);

  const undo = useCallback(() => {
    if (!isEditMode || draft.actions.length === 0) return;

    setDraft(prev => {
      const lastAction = prev.actions[prev.actions.length - 1];
      const newActions = prev.actions.slice(0, -1);
      let newDraft = { ...prev, actions: newActions };

      switch (lastAction.type) {
        case 'edit':
          if (lastAction.nodeId && lastAction.previousData) {
            const classIndex = newDraft.classes.findIndex(c => c.id === lastAction.nodeId);
            const instanceIndex = newDraft.instances.findIndex(i => i.id === lastAction.nodeId);
            
            if (classIndex !== -1) {
              newDraft.classes[classIndex] = lastAction.previousData;
            } else if (instanceIndex !== -1) {
              newDraft.instances[instanceIndex] = lastAction.previousData;
            }
          }
          break;
        case 'move':
          if (lastAction.nodeId && lastAction.previousData) {
            const classIndex = newDraft.classes.findIndex(c => c.id === lastAction.nodeId);
            const instanceIndex = newDraft.instances.findIndex(i => i.id === lastAction.nodeId);
            
            if (classIndex !== -1) {
              newDraft.classes[classIndex].position = lastAction.previousData;
            } else if (instanceIndex !== -1) {
              newDraft.instances[instanceIndex].position = lastAction.previousData;
            }
          }
          break;
        case 'add':
          if (lastAction.nodeId) {
            newDraft.classes = newDraft.classes.filter(c => c.id !== lastAction.nodeId);
            newDraft.instances = newDraft.instances.filter(i => i.id !== lastAction.nodeId);
            newDraft.modifiedNodes.delete(lastAction.nodeId);
          }
          break;
        case 'delete':
          if (lastAction.nodeId && lastAction.previousData) {
            if ('properties' in lastAction.previousData && Array.isArray(lastAction.previousData.properties)) {
              newDraft.classes.push(lastAction.previousData);
            } else {
              newDraft.instances.push(lastAction.previousData);
            }
            newDraft.modifiedNodes.add(lastAction.nodeId);
          }
          break;
      }

      return newDraft;
    });
  }, [isEditMode, draft.actions]);

  const validateDraft = useCallback(() => {
    const errors: string[] = [];
    
    // Check for empty names
    draft.classes.forEach(cls => {
      if (!cls.name.trim()) {
        errors.push(`Class ${cls.id} has empty name`);
      }
    });

    draft.instances.forEach(inst => {
      if (!inst.name.trim()) {
        errors.push(`Instance ${inst.id} has empty name`);
      }
    });

    // Check for dangling relations
    draft.relations.forEach(rel => {
      const sourceExists = draft.classes.some(c => c.id === rel.sourceId) || 
                          draft.instances.some(i => i.id === rel.sourceId);
      const targetExists = draft.classes.some(c => c.id === rel.targetId) || 
                          draft.instances.some(i => i.id === rel.targetId);
      
      if (!sourceExists || !targetExists) {
        errors.push(`Relation ${rel.id} has dangling reference`);
      }
    });

    return errors;
  }, [draft]);

  const save = useCallback((onSuccess: (workspace: TBox) => void) => {
    const errors = validateDraft();
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const updatedWorkspace: TBox = {
      ...initialWorkspace,
      classes: draft.classes,
      instances: draft.instances,
      properties: draft.properties,
      relations: draft.relations,
      updatedAt: new Date()
    };

    // Persist to localStorage
    localStorage.setItem(`workspace-${initialWorkspace.id}`, JSON.stringify(updatedWorkspace));
    
    onSuccess(updatedWorkspace);
    exitEditMode();
    
    return { success: true, errors: [] };
  }, [draft, initialWorkspace, validateDraft, exitEditMode]);

  const cancel = useCallback(() => {
    exitEditMode();
  }, [exitEditMode]);

  const hasChanges = draft.actions.length > 0;
  const canUndo = draft.actions.length > 0;

  return {
    isEditMode,
    draft,
    hasChanges,
    canUndo,
    enterEditMode,
    exitEditMode,
    updateNode,
    moveNode,
    addNode,
    deleteNode,
    updateRelation,
    undo,
    save,
    cancel,
    validateDraft
  };
}