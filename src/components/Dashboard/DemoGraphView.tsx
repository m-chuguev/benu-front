import React, { useState, useRef } from 'react';
import { Workspace } from '../../types/ontology';

interface DemoGraphViewProps {
  workspace: Workspace;
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string;
  highlightedNodes?: string[];
  isEditMode?: boolean;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
}

const DemoGraphView: React.FC<DemoGraphViewProps> = ({
  workspace,
  onNodeSelect,
  selectedNodeId,
}) => {
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2); // Start at 120% zoom
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if workspace has A-Box instances
  const hasABoxData = workspace.instances && workspace.instances.length > 0;
  const hasOnlyTBox = workspace.classes && workspace.classes.length > 0 && (!workspace.instances || workspace.instances.length === 0);

  // Mock node selection for demo
  const handleNodeClick = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - backgroundPosition.x,
      y: e.clientY - backgroundPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setBackgroundPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2)); // Max 200%
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.2)); // Min 20%
  };

  const handleResetView = () => {
    setZoom(1.2);
    setBackgroundPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-gray-50 relative overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Demo Graph Image */}
      <div 
        className="absolute bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: 'url(/images/demo/graph-demo.png)',
          backgroundSize: `${zoom * 100}%`,
          width: '100%',
          height: '100%',
          left: `${backgroundPosition.x}px`,
          top: `${backgroundPosition.y}px`
        }}
      />
      
      {/* A-Box data overlay - only show when instances exist */}
      {hasABoxData && (
        <>
          {/* Animated instance indicators */}
          <div 
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"
            style={{ transform: 'translate(25px, 25px)' }}
            title="Instance: api-pod-3"
          />
          
          <div 
            className="absolute top-1/2 right-1/3 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"
            style={{ transform: 'translate(20px, 20px)' }}
            title="Instance: web-service"
          />
          
          <div 
            className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"
            style={{ transform: 'translate(25px, 25px)' }}
            title="Instance: rolling-strategy"
          />
          
          <div 
            className="absolute top-1/4 left-1/3 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"
            title="Instance: web-controller"
          />
          
          <div 
            className="absolute top-2/3 left-1/4 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"
            title="Instance: production-ns"
          />
        </>
      )}
      
      {/* Interactive areas overlay */}
      <div 
        className={`absolute top-1/3 right-1/4 w-20 h-20 cursor-pointer rounded-full transition-colors pointer-events-auto ${
          hasABoxData ? 'hover:bg-green-200 hover:bg-opacity-40' : 'hover:bg-blue-200 hover:bg-opacity-30'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick('api-pod-3');
        }}
        title="api-pod-3"
      />
      
      <div 
        className={`absolute top-1/2 right-1/3 w-16 h-16 cursor-pointer rounded-full transition-colors pointer-events-auto ${
          hasABoxData ? 'hover:bg-green-200 hover:bg-opacity-40' : 'hover:bg-blue-200 hover:bg-opacity-30'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick('web-service');
        }}
        title="web-service"
      />
      
      <div 
        className={`absolute bottom-1/3 right-1/4 w-18 h-18 cursor-pointer rounded-full transition-colors pointer-events-auto ${
          hasABoxData ? 'hover:bg-green-200 hover:bg-opacity-40' : 'hover:bg-blue-200 hover:bg-opacity-30'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick('rolling-strategy');
        }}
        title="rolling-strategy"
      />
      
      {/* Graph controls overlay */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2 flex gap-2">
        <button 
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 3z"/>
          </svg>
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          onClick={handleResetView}
          title="Reset View"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
          </svg>
        </button>
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-48 bg-white rounded-lg shadow-md px-3 py-1 text-sm font-medium text-gray-700">
        {Math.round(zoom * 100)}%
      </div>
      
      {/* Mini map overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 w-32 h-24">
        <div className="w-full h-full bg-gray-100 rounded relative">
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>
      

    </div>
  );
};

export default DemoGraphView;
