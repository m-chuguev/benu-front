import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { TBox, GraphNode, GraphEdge } from '../../types/ontology';
import { autoLayoutGraph, LayoutNode, LayoutEdge } from '../../utils/graphLayout';
import { 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Grid3X3,
  Table,
  ChevronRight,
  Users,
  GraduationCap,
  User,
  BookOpen,
  Building,
  FileText,
  Brain,
  Network,
  Eye,
  Database,
  Car,
  Truck,
  Settings,
  Globe
} from 'lucide-react';

interface GraphViewProps {
  workspace: TBox;
  onNodeSelect: (nodeId: string) => void;
  onToggleInspector: () => void;
  isInspectorOpen?: boolean;
  selectedNodeId?: string;
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
  onOpenFullscreen?: () => void;
  isFullscreen?: boolean;
}

interface ContextMenu {
  x: number;
  y: number;
  type: 'node' | 'edge';
  targetId: string;
}

export default function GraphView({ 
  workspace, 
  onNodeSelect, 
  onToggleInspector,
  isInspectorOpen = false,
  selectedNodeId, 
  highlightedNodes = [],
  isEditMode = false,
  modifiedNodes = new Set(),
  modifiedEdges = new Set(),
  onNodeMove,
  onNodeEdit,
  onNodeDelete,
  onNodeDuplicate,
  onRelationEdit,
  onRelationDelete,
  onOpenFullscreen,
  isFullscreen = false
}: GraphViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle keyboard events for space key (pan mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const { nodes, edges } = useMemo(() => {
    const nodes: GraphNode[] = [
      ...workspace.classes.map(c => ({
        id: c.id,
        name: c.name,
        type: 'class' as const,
        boxType: c.type,
        position: c.position
      })),
      ...workspace.instances.map(i => ({
        id: i.id,
        name: i.name,
        type: 'instance' as const,
        boxType: i.type,
        position: i.position
      }))
    ];

    const edges: GraphEdge[] = workspace.relations.map(r => {
      const property = workspace.properties.find(p => p.id === r.propertyId);
      return {
        id: r.id,
        source: r.sourceId,
        target: r.targetId,
        label: property?.name || r.propertyId,
        type: r.type
      };
    });

    // Применяем автоматическую компоновку если включена
    if (autoLayoutEnabled && nodes.length > 0) {
      const layoutNodes: LayoutNode[] = nodes.map(node => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: 120,
        height: 60,
        type: node.type,
        boxType: node.boxType
      }));

      const layoutEdges: LayoutEdge[] = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.label === 'inheritance' ? 'inheritance' : 'relation'
      }));

      const containerRect = containerRef.current?.getBoundingClientRect();
      const layoutConfig = {
        canvasWidth: containerRect?.width || 1200,
        canvasHeight: containerRect?.height || 800,
        nodeSpacing: 180,
        levelSpacing: 150,
        iterations: 50
      };

      const layoutedNodes = autoLayoutGraph(layoutNodes, layoutEdges, layoutConfig);
      
      // Обновляем позиции узлов
      layoutedNodes.forEach(layoutNode => {
        const originalNode = nodes.find(n => n.id === layoutNode.id);
        if (originalNode) {
          originalNode.position = { x: layoutNode.x, y: layoutNode.y };
        }
      });
    }

    return { nodes, edges };
  }, [workspace, autoLayoutEnabled]);

  const filteredNodes = useMemo(() => {
    return nodes.filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nodes, searchTerm]);

  // Get icon for node based on name/type
  const getNodeIcon = (node: GraphNode) => {
    const name = node.name.toLowerCase();
    if (name.includes('person') || name.includes('человек')) return Users;
    if (name.includes('professor') || name.includes('преподаватель')) return GraduationCap;
    if (name.includes('student') || name.includes('студент')) return User;
    if (name.includes('course') || name.includes('курс')) return BookOpen;
    if (name.includes('university') || name.includes('университет')) return Building;
    if (name.includes('document') || name.includes('документ')) return FileText;
    if (name.includes('knowledge') || name.includes('знание')) return Brain;
    if (name.includes('ontology') || name.includes('онтология')) return Network;
    if (name.includes('perception') || name.includes('восприятие')) return Eye;
    if (name.includes('car') || name.includes('машина')) return Car;
    if (name.includes('truck') || name.includes('грузовик')) return Truck;
    if (name.includes('vehicle') || name.includes('транспорт')) return Car;
    if (name.includes('system') || name.includes('система')) return Settings;
    if (name.includes('world') || name.includes('мир')) return Globe;
    return Database; // default icon
  };

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current && (isSpacePressed || !isEditMode)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isSpacePressed, isEditMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (isDraggingNode && dragNodeId && isEditMode) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const newPosition = {
          x: (e.clientX - rect.left - panOffset.x - dragOffset.x) / zoomLevel,
          y: (e.clientY - rect.top - panOffset.y - dragOffset.y) / zoomLevel
        };
        onNodeMove?.(dragNodeId, newPosition);
      }
    }
  }, [isPanning, lastPanPoint, isDraggingNode, dragNodeId, isEditMode, dragOffset, zoomLevel, panOffset, onNodeMove]);

  const handleMouseUp = useCallback(() => {
    if (!isSpacePressed) setIsPanning(false);
    setIsDraggingNode(false);
    setDragNodeId(null);
  }, [isSpacePressed]);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    setIsDraggingNode(true);
    setDragNodeId(nodeId);
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const node = filteredNodes.find(n => n.id === nodeId);
      if (node) {
        setDragOffset({
          x: e.clientX - rect.left - panOffset.x - node.position.x * zoomLevel,
          y: e.clientY - rect.top - panOffset.y - node.position.y * zoomLevel
        });
      }
    }
  }, [isEditMode, filteredNodes, zoomLevel, panOffset]);

  const handleContextMenu = useCallback((e: React.MouseEvent, type: 'node' | 'edge', targetId: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      targetId
    });
  }, [isEditMode]);

  const handleContextAction = useCallback((action: string, targetId: string) => {
    setContextMenu(null);
    
    switch (action) {
      case 'edit':
        onNodeEdit?.(targetId);
        break;
      case 'duplicate':
        onNodeDuplicate?.(targetId);
        break;
      case 'delete':
        onNodeDelete?.(targetId);
        break;
      case 'editRelation':
        onRelationEdit?.(targetId);
        break;
      case 'deleteRelation':
        onRelationDelete?.(targetId);
        break;
    }
  }, [onNodeEdit, onNodeDuplicate, onNodeDelete, onRelationEdit, onRelationDelete]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.3, Math.min(3, prev + delta)));
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.3, prev - 0.2));
  const handleFitToScreen = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleToggleAutoLayout = () => {
    setAutoLayoutEnabled(!autoLayoutEnabled);
  };

  if (viewMode === 'table') {
    return (
      <div className="flex-1 bg-white flex flex-col">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('graph')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors text-gray-600 hover:text-gray-900"
              >
                <Grid3X3 size={14} />
                <span className="text-sm">Graph</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors bg-white text-gray-900 shadow-sm"
              >
                <Table size={14} />
                <span className="text-sm">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Box</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        node.boxType === 'tbox' ? 'bg-gray-400' : 'bg-blue-400'
                      }`} />
                      <div className="text-sm font-medium text-gray-900">{node.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {node.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      node.boxType === 'tbox' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {node.boxType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onNodeSelect(node.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-white flex flex-col relative">
      {/* Graph Controls */}
      {!isFullscreen && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter size={16} />
                <span>Filters</span>
              </button>

              <button 
                onClick={handleToggleAutoLayout}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  autoLayoutEnabled 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Network size={16} />
                <span>Auto Layout</span>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('graph')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors bg-white text-gray-900 shadow-sm"
              >
                <Grid3X3 size={14} />
                <span className="text-sm">Graph</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors text-gray-600 hover:text-gray-900"
              >
                <Table size={14} />
                <span className="text-sm">Table</span>
              </button>
            </div>

            {/* Inspector Toggle */}
            {!isFullscreen && (
              <button
                onClick={onToggleInspector}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                title={`${isInspectorOpen ? 'Hide' : 'Show'} Inspector`}
              >
                <ChevronRight 
                  size={16} 
                  className={`transform transition-transform duration-200 ${
                    isInspectorOpen ? 'rotate-180' : ''
                  }`}
                />
                <span className="text-sm">Inspector</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Graph Canvas */}
      <div 
        ref={containerRef}
        className="h-[600px] relative overflow-hidden bg-gray-50"
        style={{ 
          cursor: isPanning ? 'grabbing' : 
                 isSpacePressed ? 'grab' : 
                 isEditMode ? 'default' : 'grab' 
        }}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Definitions */}
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.5"/>
            </pattern>
            
            {/* Arrow markers */}
            <marker
              id="arrowhead-tbox"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
            <marker
              id="arrowhead-abox"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const sourceNode = filteredNodes.find(n => n.id === edge.source);
              const targetNode = filteredNodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode) return null;

              const nodeWidth = 120;
              const nodeHeight = 60;
              const x1 = sourceNode.position.x;
              const y1 = sourceNode.position.y;
              const x2 = targetNode.position.x;
              const y2 = targetNode.position.y;

              // Calculate edge endpoints
              const dx = x2 - x1;
              const dy = y2 - y1;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              const startX = x1 + (dx / distance) * (nodeWidth / 2);
              const startY = y1 + (dy / distance) * (nodeHeight / 2);
              const endX = x2 - (dx / distance) * (nodeWidth / 2);
              const endY = y2 - (dy / distance) * (nodeHeight / 2);

              const isHovered = hoveredEdgeId === edge.id;
              const isModified = modifiedEdges.has(edge.id);
              const isTBox = edge.type === 'tbox';
              
              const strokeColor = isTBox ? '#6b7280' : '#3b82f6';
              const strokeWidth = isHovered || isModified ? 3 : 2;
              const markerEnd = isTBox ? 'url(#arrowhead-tbox)' : 'url(#arrowhead-abox)';

              // Calculate label position
              const labelX = (startX + endX) / 2;
              const labelY = (startY + endY) / 2;

              return (
                <g key={edge.id}>
                  {/* Edge line */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                    strokeDasharray={isTBox ? '0' : '5,5'}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredEdgeId(edge.id)}
                    onMouseLeave={() => setHoveredEdgeId(null)}
                    onClick={() => onNodeSelect(edge.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'edge', edge.id)}
                  />
                  
                  {/* Edge label */}
                  {edge.label && (
                    <g>
                      <rect
                        x={labelX - edge.label.length * 4}
                        y={labelY - 10}
                        width={edge.label.length * 8}
                        height={20}
                        fill="white"
                        stroke={strokeColor}
                        strokeWidth="1"
                        rx="10"
                      />
                      <text
                        x={labelX}
                        y={labelY + 4}
                        textAnchor="middle"
                        className="pointer-events-none select-none text-xs font-medium"
                        fill={strokeColor}
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isHighlighted = highlightedNodes.includes(node.id);
              const isModified = modifiedNodes.has(node.id);
              
              const isTBox = node.boxType === 'tbox';
              const nodeWidth = 120;
              const nodeHeight = 60;
              const IconComponent = getNodeIcon(node);

              // Colors
              const fillColor = isTBox ? '#f9fafb' : '#eff6ff';
              const strokeColor = isTBox ? '#d1d5db' : '#bfdbfe';
              const textColor = isTBox ? '#6b7280' : '#3b82f6';

              return (
                <g key={node.id} className="cursor-pointer">
                  {/* Selection ring */}
                  {isSelected && (
                    <rect
                      x={node.position.x - nodeWidth/2 - 4}
                      y={node.position.y - nodeHeight/2 - 4}
                      width={nodeWidth + 8}
                      height={nodeHeight + 8}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      rx="12"
                      className="animate-pulse"
                    />
                  )}

                  {/* Modified indicator */}
                  {isModified && (
                    <rect
                      x={node.position.x - nodeWidth/2 - 2}
                      y={node.position.y - nodeHeight/2 - 2}
                      width={nodeWidth + 4}
                      height={nodeHeight + 4}
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      rx="10"
                    />
                  )}

                  {/* Main node rectangle */}
                  <rect
                    x={node.position.x - nodeWidth/2}
                    y={node.position.y - nodeHeight/2}
                    width={nodeWidth}
                    height={nodeHeight}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHovered ? '2' : '1'}
                    rx="8"
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => onNodeSelect(node.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'node', node.id)}
                    style={{ cursor: isEditMode ? 'move' : 'pointer' }}
                    className="transition-all duration-200"
                  />

                  {/* Node icon and text */}
                  <g>
                    {/* Icon circle */}
                    <circle
                      cx={node.position.x - nodeWidth/2 + 20}
                      cy={node.position.y - 5}
                      r="12"
                      fill={textColor}
                      className="pointer-events-none"
                    />
                    
                    {/* Icon */}
                    <g transform={`translate(${node.position.x - nodeWidth/2 + 20}, ${node.position.y - 5})`}>
                      <IconComponent 
                        size={16} 
                        className="pointer-events-none" 
                        style={{ color: 'white', transform: 'translate(-8px, -8px)' }}
                        strokeWidth={2}
                      />
                    </g>

                    {/* Node name */}
                    <text
                      x={node.position.x - nodeWidth/2 + 40}
                      y={node.position.y - 8}
                      className="font-semibold pointer-events-none select-none text-sm"
                      fill="#1f2937"
                    >
                      {node.name.length > 12 ? `${node.name.substring(0, 12)}...` : node.name}
                    </text>

                    {/* Node type */}
                    <text
                      x={node.position.x - nodeWidth/2 + 40}
                      y={node.position.y + 8}
                      className="pointer-events-none select-none text-xs"
                      fill="#6b7280"
                    >
                      ({node.type === 'class' ? 'Class' : 'Instance'})
                    </text>
                  </g>

                  {/* Highlight animation */}
                  {isHighlighted && (
                    <rect
                      x={node.position.x - nodeWidth/2 - 8}
                      y={node.position.y - nodeHeight/2 - 8}
                      width={nodeWidth + 16}
                      height={nodeHeight + 16}
                      fill="none"
                      stroke={textColor}
                      strokeWidth="3"
                      rx="16"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors flex items-center justify-center"
          >
            <ZoomIn size={14} className="text-gray-600" />
          </button>
          <div className="w-8 h-6 bg-gray-50 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors flex items-center justify-center"
          >
            <ZoomOut size={14} className="text-gray-600" />
          </button>
          <button
            onClick={handleFitToScreen}
            className="w-8 h-8 bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors flex items-center justify-center"
          >
            <Maximize2 size={14} className="text-gray-600" />
          </button>
          {!isFullscreen && onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="w-8 h-8 bg-white hover:bg-gray-50 border border-gray-300 rounded transition-colors flex items-center justify-center"
              title="Open fullscreen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-600">{workspace.classes.length}</span> classes, 
            <span className="font-medium text-blue-600 ml-1">{workspace.instances.length}</span> instances,
            <span className="font-medium text-gray-700 ml-1">{edges.length}</span> relations
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'node' ? (
            <>
              <button
                onClick={() => handleContextAction('edit', contextMenu.targetId)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleContextAction('duplicate', contextMenu.targetId)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Дублировать
              </button>
              <button
                onClick={() => handleContextAction('delete', contextMenu.targetId)}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Удалить
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleContextAction('editRelation', contextMenu.targetId)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Редактировать связь
              </button>
              <button
                onClick={() => handleContextAction('deleteRelation', contextMenu.targetId)}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Удалить связь
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}