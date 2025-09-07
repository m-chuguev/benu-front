import React from 'react';
import { TBox } from '../../types/ontology';

interface DemoGraphSimpleProps {
  workspace: TBox;
}

export default function DemoGraphSimple({ workspace }: DemoGraphSimpleProps) {
  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 1400 1000">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connections first (behind nodes) */}
        {workspace.relations.map((relation) => {
          const sourceNode = [...workspace.classes, ...workspace.instances].find(n => n.id === relation.sourceId);
          const targetNode = [...workspace.classes, ...workspace.instances].find(n => n.id === relation.targetId);
          
          if (!sourceNode || !targetNode) return null;
          
          const isABox = relation.type === 'abox';
          
          return (
            <g key={relation.id}>
              {/* Connection line */}
              <line
                x1={sourceNode.position.x + 60}
                y1={sourceNode.position.y + 30}
                x2={targetNode.position.x + 60}
                y2={targetNode.position.y + 30}
                stroke={isABox ? "#3b82f6" : "#6b7280"}
                strokeWidth="2"
                strokeDasharray={isABox ? "none" : "5,5"}
                markerEnd="url(#arrowhead)"
              />
              
              {/* Label */}
              <text
                x={(sourceNode.position.x + targetNode.position.x) / 2 + 60}
                y={(sourceNode.position.y + targetNode.position.y) / 2 + 25}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
                style={{ fontSize: '10px' }}
              >
                {workspace.properties.find(p => p.id === relation.propertyId)?.name || 'relation'}
              </text>
            </g>
          );
        })}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
        
        {/* T-Box Classes */}
        {workspace.classes.map((cls) => (
          <g key={cls.id}>
            <rect
              x={cls.position.x}
              y={cls.position.y}
              width="120"
              height="60"
              rx="8"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            <text
              x={cls.position.x + 60}
              y={cls.position.y + 30}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-900"
            >
              {cls.name}
            </text>
            <text
              x={cls.position.x + 60}
              y={cls.position.y + 45}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              Class (T-Box)
            </text>
          </g>
        ))}
        
        {/* A-Box Instances */}
        {workspace.instances.map((instance) => (
          <g key={instance.id}>
            <rect
              x={instance.position.x}
              y={instance.position.y}
              width="120"
              height="60"
              rx="8"
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text
              x={instance.position.x + 60}
              y={instance.position.y + 30}
              textAnchor="middle"
              className="text-sm font-medium fill-blue-900"
            >
              {instance.name}
            </text>
            <text
              x={instance.position.x + 60}
              y={instance.position.y + 45}
              textAnchor="middle"
              className="text-xs fill-blue-600"
            >
              Instance (A-Box)
            </text>
          </g>
        ))}
      </svg>
      

    </div>
  );
}
