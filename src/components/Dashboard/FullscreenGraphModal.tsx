import React from 'react';
import { X } from 'lucide-react';
import { Workspace } from '../../types/ontology';
import GraphView from './GraphView';

interface FullscreenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
  selectedNodeId?: string;
  onNodeSelect: (nodeId: string) => void;
  highlightedNodes?: string[];
  isEditMode?: boolean;
  modifiedNodes?: Set<string>;
  modifiedEdges?: Set<string>;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeEdit?: (nodeId: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDuplicate?: (nodeId: string) => void;
  onRelationEdit?: (relationId: string) => void;
  onRelationDelete?: (relationId: string) => void;
}

export default function FullscreenGraphModal({
  isOpen,
  onClose,
  workspace,
  selectedNodeId,
  onNodeSelect,
  highlightedNodes = [],
  isEditMode = false,
  modifiedNodes = new Set(),
  modifiedEdges = new Set(),
  onNodeMove,
  onNodeEdit,
  onNodeDelete,
  onNodeDuplicate,
  onRelationEdit,
  onRelationDelete
}: FullscreenGraphModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="w-full h-full bg-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-colors flex items-center justify-center"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-900">{workspace.name} - Fullscreen View</h2>
        </div>

        {/* Fullscreen Graph */}
        <div className="w-full h-full">
          <GraphView
            workspace={workspace}
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
            highlightedNodes={highlightedNodes}
            isEditMode={isEditMode}
            modifiedNodes={modifiedNodes}
            modifiedEdges={modifiedEdges}
            onNodeMove={onNodeMove}
            onNodeEdit={onNodeEdit}
            onNodeDelete={onNodeDelete}
            onNodeDuplicate={onNodeDuplicate}
            onRelationEdit={onRelationEdit}
            onRelationDelete={onRelationDelete}
            onOpenFullscreen={() => {}} // Disable nested fullscreen
            isFullscreen={true}
          />
        </div>
      </div>
    </div>
  );
}