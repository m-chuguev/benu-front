import React, { useState } from 'react';
import { Workspace, OntologyClass, OntologyInstance, OntologyProperty } from '../../types/ontology';
import { useDraftState } from '../../hooks/useDraftState';
import TopBar from './TopBar';
import StatsPanel from './StatsPanel';
import DemoGraphSimple from './DemoGraphSimple';
import ObjectInspector from './ObjectInspector';
import AIPanel from './AIPanel';
import UploadDataModal from '../Modals/UploadDataModal';
import AddClassModal from '../Modals/AddClassModal';
import AddInstanceModal from '../Modals/AddInstanceModal';
import ValidationModal from '../Modals/ValidationModal';
import { UploadPreview, ApprovedSections } from '../../types/ontology';
import FullscreenGraphModal from './FullscreenGraphModal';

interface DashboardProps {
  workspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}



interface Property {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'IRI';
}

export default function Dashboard({ workspace, onWorkspaceChange }: DashboardProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddInstanceModal, setShowAddInstanceModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [showFullscreenGraph, setShowFullscreenGraph] = useState(false);

  // Use draft state management
  const {
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
    cancel
  } = useDraftState(workspace);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleToggleInspector = () => {
    setIsInspectorOpen(!isInspectorOpen);
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      exitEditMode();
    } else {
      enterEditMode();
    }
  };

  const handleToggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  const handleDelete = (nodeId: string) => {
    deleteNode(nodeId);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(undefined);
    }
  };

  const handleAddProperty = (nodeId: string) => {
    console.log('Adding property to node:', nodeId);
  };

  const handleAddRelation = (nodeId: string) => {
    console.log('Adding relation to node:', nodeId);
  };

  const handleUploadData = () => {
    setShowUploadModal(true);
  };

  const handleRunValidation = () => {
    setShowValidationModal(true);
  };

  const handleAddClass = () => {
    setShowAddClassModal(true);
  };

  const handleAddInstance = () => {
    setShowAddInstanceModal(true);
  };

  const handleNodeMove = (nodeId: string, position: { x: number; y: number }) => {
    moveNode(nodeId, position);
  };

  const handleNodeEdit = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeDuplicate = (nodeId: string) => {
    const existingClass = draft.classes.find(c => c.id === nodeId);
    const existingInstance = draft.instances.find(i => i.id === nodeId);
    
    if (existingClass) {
      const duplicatedClass: OntologyClass = {
        ...existingClass,
        id: `${existingClass.id}-copy-${Date.now()}`,
        name: `${existingClass.name} (Copy)`,
        position: {
          x: existingClass.position.x + 50,
          y: existingClass.position.y + 50
        }
      };
      addNode(duplicatedClass);
    } else if (existingInstance) {
      const duplicatedInstance: OntologyInstance = {
        ...existingInstance,
        id: `${existingInstance.id}-copy-${Date.now()}`,
        name: `${existingInstance.name} (Copy)`,
        position: {
          x: existingInstance.position.x + 50,
          y: existingInstance.position.y + 50
        }
      };
      addNode(duplicatedInstance);
    }
  };

  const handleRelationEdit = (relationId: string) => {
    console.log('Editing relation:', relationId);
  };

  const handleRelationDelete = (relationId: string) => {
    console.log('Deleting relation:', relationId);
  };

  const handleSave = () => {
    const result = save(onWorkspaceChange);
    if (result.success) {
      console.log('Changes saved successfully');
    } else {
      console.log('Validation errors:', result.errors);
    }
  };

  const handleCancel = () => {
    cancel();
  };

  const handleUndo = () => {
    undo();
  };

  const handleUploadApprove = (preview: UploadPreview, approvedSections: ApprovedSections) => {
    console.log('Approving upload:', { preview, approvedSections });
    
    // Get IDs of new items for highlighting
    const newNodeIds = [
      ...(approvedSections.classes ? preview.classes.map(c => c.id) : []),
      ...(approvedSections.instances ? preview.instances.map(i => i.id) : [])
    ];
    
    // Create updated workspace with new data
    const updatedWorkspace: Workspace = {
      ...workspace,
      updatedAt: new Date(),
      classes: [
        ...workspace.classes,
        ...(approvedSections.classes ? preview.classes : [])
      ],
      properties: [
        ...workspace.properties,
        ...(approvedSections.properties ? preview.properties : [])
      ],
      instances: [
        ...workspace.instances,
        ...(approvedSections.instances ? preview.instances : [])
      ],
      relations: [
        ...workspace.relations,
        ...preview.relations
      ]
    };
    
    onWorkspaceChange(updatedWorkspace);
    setHighlightedNodes(newNodeIds);
    setShowUploadModal(false);
    
    // Clear highlights after 3 seconds
    setTimeout(() => {
      setHighlightedNodes([]);
    }, 3000);
  };

  const handleSaveClass = (className: string, description: string, properties: Property[]) => {
    const newClassId = `class-${Date.now()}`;
    
    // Create new properties
    const newProperties: OntologyProperty[] = properties.map(prop => ({
      id: `prop-${Date.now()}-${prop.name}`,
      name: prop.name,
      description: `Property of ${className}`,
      domain: newClassId,
      range: prop.type,
      type: 'tbox' as const
    }));

    // Create new class
    const newClass: OntologyClass = {
      id: newClassId,
      name: className,
      description,
      properties: newProperties.map(p => p.id),
      type: 'tbox',
      position: { x: 200 + Math.random() * 200, y: 150 + Math.random() * 200 }
    };

    // Update workspace
    const updatedWorkspace: Workspace = {
      ...workspace,
      updatedAt: new Date(),
      classes: [...workspace.classes, newClass],
      properties: [...workspace.properties, ...newProperties]
    };

    onWorkspaceChange(updatedWorkspace);
    setHighlightedNodes([newClassId]);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedNodes([]);
    }, 3000);
  };

  const handleSaveInstance = (instanceName: string, classId: string, propertyValues: Record<string, any>) => {
    const newInstanceId = `instance-${Date.now()}`;
    
    // Create new instance
    const newInstance: OntologyInstance = {
      id: newInstanceId,
      name: instanceName,
      classId,
      properties: propertyValues,
      type: 'abox',
      position: { x: 300 + Math.random() * 200, y: 250 + Math.random() * 200 }
    };

    // Update workspace
    const updatedWorkspace: Workspace = {
      ...workspace,
      updatedAt: new Date(),
      instances: [...workspace.instances, newInstance]
    };

    onWorkspaceChange(updatedWorkspace);
    setHighlightedNodes([newInstanceId]);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedNodes([]);
    }, 3000);
  };

  const handleNavigateToNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleUpdateNode = (nodeId: string, updates: any) => {
    updateNode(nodeId, updates);
  };

  const handleOpenFullscreen = () => {
    setShowFullscreenGraph(true);
  };

  const handleCloseFullscreen = () => {
    setShowFullscreenGraph(false);
  };

  const handleUpdateWorkspace = (updates: { name?: string; description?: string }) => {
    const updatedWorkspace: Workspace = {
      ...workspace,
      ...updates,
      updatedAt: new Date()
    };
    onWorkspaceChange(updatedWorkspace);
  };

  // Use draft workspace for display
  const displayWorkspace: Workspace = {
    ...workspace,
    classes: draft.classes,
    instances: draft.instances,
    properties: draft.properties,
    relations: draft.relations
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <TopBar
        workspace={workspace}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        onToggleAI={handleToggleAIPanel}
        onUpdateWorkspace={handleUpdateWorkspace}
      />

      {/* Stats Panel */}
      <StatsPanel workspace={workspace} />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Graph View */}
        <div className="flex-1 flex flex-col">
        <DemoGraphSimple
            workspace={workspace}
          />
        </div>
        
        {/* Object Inspector */}
        <ObjectInspector
          workspace={workspace}
          selectedNodeId={selectedNodeId}
          isOpen={isInspectorOpen}
          onToggle={handleToggleInspector}
          onEdit={handleNodeEdit}
          onDelete={handleDelete}
          onAddProperty={handleAddProperty}
          onAddRelation={handleAddRelation}
          onUploadData={handleUploadData}
          onRunValidation={handleRunValidation}
          isEditMode={isEditMode}
          isModified={selectedNodeId ? draft.modifiedNodes.has(selectedNodeId) : false}
          onUpdateNode={handleUpdateNode}
          onAddClass={handleAddClass}
          onAddInstance={handleAddInstance}
          onSave={handleSave}
          onCancel={handleCancel}
          onUndo={handleUndo}
          hasChanges={hasChanges}
          canUndo={canUndo}
        />
      </div>

      {/* AI Panel - only show when open */}
      {isAIPanelOpen && (
        <div className="fixed right-0 top-0 h-full z-30">
          <AIPanel
            isOpen={isAIPanelOpen}
            onToggle={handleToggleAIPanel}
            workspaceName={workspace.title}
          />
        </div>
      )}

      {/* Modals */}
      <UploadDataModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onApprove={handleUploadApprove}
      />

      <AddClassModal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        onSave={handleSaveClass}
      />

      <AddInstanceModal
        isOpen={showAddInstanceModal}
        onClose={() => setShowAddInstanceModal(false)}
        onSave={handleSaveInstance}
        classes={displayWorkspace.classes}
        properties={displayWorkspace.properties}
      />

      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        onNavigateToNode={handleNavigateToNode}
      />

      <FullscreenGraphModal
        isOpen={showFullscreenGraph}
        onClose={handleCloseFullscreen}
        workspace={displayWorkspace}
        selectedNodeId={selectedNodeId}
        onNodeSelect={handleNodeSelect}
        highlightedNodes={highlightedNodes}
        isEditMode={isEditMode}
        modifiedNodes={draft.modifiedNodes}
        modifiedEdges={draft.modifiedEdges}
        onNodeMove={handleNodeMove}
        onNodeEdit={handleNodeEdit}
        onNodeDelete={handleDelete}
        onNodeDuplicate={handleNodeDuplicate}
        onRelationEdit={handleRelationEdit}
        onRelationDelete={handleRelationDelete}
      />
    </div>
  );
}