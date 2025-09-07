import React, { useMemo, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workspace } from '../../types/ontology';
import { hierarchicalLayout } from '../../utils/autoLayout';

interface ReactFlowGraphProps {
  workspace: Workspace;
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string;
  highlightedNodes?: string[];
  isEditMode?: boolean;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
}

// Custom node component for better styling
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const isClass = data.type === 'class';
  const isTBox = data.boxType === 'tbox';
  
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 min-w-[120px] text-center ${
        isClass
          ? isTBox
            ? 'bg-gray-100 border-gray-300 text-gray-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
          : isTBox
          ? 'bg-green-50 border-green-300 text-green-900'
          : 'bg-blue-100 border-blue-400 text-blue-800'
      } ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="font-medium text-sm">{data.label}</div>
      <div className="text-xs opacity-75">
        {isClass ? 'Class' : 'Instance'} ({isTBox ? 'T-Box' : 'A-Box'})
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function ReactFlowGraph({
  workspace,
  onNodeSelect,
  selectedNodeId,
  highlightedNodes = [],
  isEditMode = false,
  onNodeMove
}: ReactFlowGraphProps) {
  
  // Convert workspace data to ReactFlow nodes
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    
    // Add class nodes
    workspace.classes.forEach((cls) => {
      nodes.push({
        id: cls.id,
        type: 'custom',
        position: cls.position,
        data: {
          label: cls.name,
          type: 'class',
          boxType: cls.type,
          description: cls.description
        },
        draggable: isEditMode,
        selectable: true,
      });
    });
    
    // Add instance nodes
    workspace.instances.forEach((instance) => {
      nodes.push({
        id: instance.id,
        type: 'custom',
        position: instance.position,
        data: {
          label: instance.name,
          type: 'instance',
          boxType: instance.type,
          className: workspace.classes.find(c => c.id === instance.classId)?.name || 'Unknown'
        },
        draggable: isEditMode,
        selectable: true,
      });
    });
    
    return nodes;
  }, [workspace, isEditMode]);

  // Convert workspace relations to ReactFlow edges  
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    // Get all node IDs for validation
    const allNodeIds = new Set([
      ...workspace.classes.map(c => c.id),
      ...workspace.instances.map(i => i.id)
    ]);

    // Add all relations as simple edges
    workspace.relations.forEach((relation) => {
      const property = workspace.properties.find(p => p.id === relation.propertyId);
      
      // Check if both source and target nodes exist
      if (allNodeIds.has(relation.sourceId) && allNodeIds.has(relation.targetId)) {
        edges.push({
          id: relation.id,
          source: relation.sourceId,
          target: relation.targetId,
          label: property?.name || 'relation',
          animated: relation.type === 'abox',
          style: { 
            stroke: relation.type === 'tbox' ? '#9ca3af' : '#3b82f6' 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      } else {
        console.warn(`Skipping edge ${relation.id}: source=${relation.sourceId} (exists: ${allNodeIds.has(relation.sourceId)}), target=${relation.targetId} (exists: ${allNodeIds.has(relation.targetId)})`);
      }
    });
    
    return edges;
  }, [workspace]);

  // ТЕСТ: Принудительно добавляем яркие связи
  const testEdges = initialEdges.map(edge => ({
    ...edge,
    style: { 
      stroke: '#ff0000', 
      strokeWidth: 4,
      strokeOpacity: 1
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed,
      color: '#ff0000'
    }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(testEdges);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node.id);
    }
  }, [onNodeSelect]);

  // Handle node drag end
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeMove && isEditMode) {
      onNodeMove(node.id, node.position);
    }
  }, [onNodeMove, isEditMode]);

  // Update nodes when selectedNodeId or highlightedNodes change
  const processedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
      style: {
        ...node.style,
        outline: highlightedNodes.includes(node.id) ? '3px solid #f59e0b' : 'none',
      }
    }));
  }, [nodes, selectedNodeId, highlightedNodes]);

  console.log('RENDER: nodes=', nodes.length, 'edges=', edges.length);
  console.log('EDGES ARRAY:', edges);

  return (
    <div className="w-full h-full" style={{ position: 'relative' }}>
      <ReactFlow
        nodes={processedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        style={{ width: '100%', height: '100%' }}
        proOptions={{ hideAttribution: true }}
        elementsSelectable={true}
        nodesConnectable={false}
        nodesDraggable={isEditMode}
      >
        <Background 
          color="#e5e7eb" 
          gap={20} 
          size={1}
        />
        <Controls 
          position="top-left"
          className="!bg-white !border !border-gray-200 !rounded-lg !shadow-sm"
        />
        <MiniMap 
          position="bottom-right"
          className="!bg-white !border !border-gray-200 !rounded-lg !shadow-sm"
          nodeColor={(node) => {
            const isClass = node.data.type === 'class';
            const isTBox = node.data.boxType === 'tbox';
            
            if (isClass) {
              return isTBox ? '#9ca3af' : '#3b82f6';
            } else {
              return isTBox ? '#10b981' : '#1d4ed8';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
