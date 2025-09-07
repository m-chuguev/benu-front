import React, { useState } from 'react';
import { Workspace, OntologyClass, OntologyInstance } from '../../types/ontology';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Undo,
  Tag,
  Database,
  Upload,
  CheckCircle
} from 'lucide-react';

interface ObjectInspectorProps {
  workspace: Workspace;
  selectedNodeId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAddProperty: (nodeId: string) => void;
  onAddRelation: (nodeId: string) => void;
  onUploadData: () => void;
  onRunValidation: () => void;
  isEditMode?: boolean;
  isModified?: boolean;
  onUpdateNode?: (nodeId: string, updates: any) => void;
  onAddClass?: () => void;
  onAddInstance?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onUndo?: () => void;
  hasChanges?: boolean;
  canUndo?: boolean;
}

export default function ObjectInspector({ 
  workspace, 
  selectedNodeId, 
  isOpen,
  onEdit, 
  onDelete, 
  onAddProperty, 
  onAddRelation,
  onUploadData,
  onRunValidation,
  isEditMode = false,
  isModified = false,
  onUpdateNode,
  onAddClass,
  onAddInstance,
  onSave,
  onCancel,
  onUndo,
  hasChanges = false,
  canUndo = false
}: ObjectInspectorProps) {
  const [editingFields, setEditingFields] = useState<any>({});
  const [showLegend, setShowLegend] = useState(false);

  const selectedObject = selectedNodeId 
    ? workspace.classes.find(c => c.id === selectedNodeId) || 
      workspace.instances.find(i => i.id === selectedNodeId)
    : null;

  if (!isOpen) {
    return null;
  }

  const handleFieldChange = (field: string, value: any) => {
    setEditingFields(prev => ({ ...prev, [field]: value }));
    if (onUpdateNode && selectedObject) {
      onUpdateNode(selectedObject.id, { [field]: value });
    }
  };

  const isClass = selectedObject && 'properties' in selectedObject && Array.isArray(selectedObject.properties);
  const isInstance = selectedObject && 'classId' in selectedObject;

  const getObjectType = () => {
    if (isClass) return 'Class';
    if (isInstance) return 'Instance';
    return 'Object';
  };

  const getRelatedObjects = () => {
    if (!selectedObject) return [];
    
    const relations = workspace.relations.filter(
      r => r.sourceId === selectedObject.id || r.targetId === selectedObject.id
    );
    
    return relations.map(relation => {
      const isSource = relation.sourceId === selectedObject.id;
      const relatedId = isSource ? relation.targetId : relation.sourceId;
      const relatedObject = workspace.classes.find(c => c.id === relatedId) || 
                           workspace.instances.find(i => i.id === relatedId);
      const property = workspace.properties.find(p => p.id === relation.propertyId);
      
      return {
        id: relation.id,
        relatedObject,
        property,
        direction: isSource ? 'outgoing' : 'incoming'
      };
    });
  };

  return (
    <>
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col shadow-lg h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {isEditMode ? 'Edit Panel' : 'Inspector'}
            </h3>
            <div className="flex items-center space-x-2">
              {isModified && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex items-center space-x-1">
                  <Tag size={10} />
                  <span>Edited</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="p-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
            <div className="space-y-3">
              {/* Save/Cancel/Undo Controls */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={onSave}
                  disabled={!hasChanges}
                  className={`flex items-center justify-center space-x-1 px-2 py-2 rounded-lg font-medium transition-colors text-xs ${
                    hasChanges 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={12} />
                  <span>Save</span>
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                >
                  <X size={12} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`flex items-center justify-center space-x-1 px-2 py-2 rounded-lg font-medium transition-colors text-xs ${
                    canUndo 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Undo size={12} />
                  <span>Undo</span>
                </button>
              </div>

              {/* Add Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onAddClass}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-xs"
                >
                  <Plus size={12} />
                  <span>Class</span>
                </button>
                <button
                  onClick={onAddInstance}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs"
                >
                  <Plus size={12} />
                  <span>Instance</span>
                </button>
                <button
                  onClick={onUploadData}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-xs"
                >
                  <Upload size={12} />
                  <span>Upload</span>
                </button>
                <button
                  onClick={onRunValidation}
                  className="flex items-center justify-center space-x-1 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs"
                >
                  <CheckCircle size={12} />
                  <span>Validate</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend Section */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-semibold text-gray-900">Legend</h4>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showLegend ? 'rotate-180' : ''}`}
            />
          </button>
          
          {showLegend && (
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: '#f8fafc', 
                    borderColor: '#64748b'
                  }}
                ></div>
                <span className="text-gray-700">T-Box (Classes)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: '#eff6ff', 
                    borderColor: '#3b82f6'
                  }}
                ></div>
                <span className="text-gray-700">A-Box (Instances)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: '#eff6ff', 
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 4px rgba(99,102,241,0.14)'
                  }}
                ></div>
                <span className="text-gray-700">Selected</span>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-4 rounded-full border-2 border-dashed"
                  style={{ 
                    backgroundColor: '#eff6ff', 
                    borderColor: '#a78bfa'
                  }}
                ></div>
                <span className="text-gray-700">Modified</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Object Details */}
        {selectedObject ? (
          <div className="p-4 space-y-6">
            {/* Object Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedObject.type === 'tbox' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedObject.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 font-medium">{getObjectType()}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900">{selectedObject.name}</h3>
              {selectedObject.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedObject.description}</p>
              )}
            </div>

            {/* Properties */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Properties</h4>
                {isEditMode && (
                  <button 
                    onClick={() => onAddProperty(selectedObject.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {/* Editable Name Field */}
                {isEditMode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingFields.name || selectedObject.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Editable Description Field */}
                {isEditMode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-1">Description</label>
                    <textarea
                      value={editingFields.description || selectedObject.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}

                {/* Instance Properties */}
                {isInstance && selectedObject.properties && (
                  Object.entries(selectedObject.properties).map(([key, value]) => (
                    <div key={key} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium text-sm text-blue-900">{key}</div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editingFields[`property_${key}`] || String(value)}
                          onChange={(e) => handleFieldChange(`property_${key}`, e.target.value)}
                          className="w-full mt-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-blue-700 mt-0.5">{String(value)}</div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Class Properties */}
                {isClass && selectedObject.properties && (
                  selectedObject.properties.map(propId => {
                    const property = workspace.properties.find(p => p.id === propId);
                    return property ? (
                      <div key={propId} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-600 mt-0.5">
                          {property.domain} → {property.range}
                        </div>
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>

            {/* Relations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Relations</h4>
                {isEditMode && (
                  <button 
                    onClick={() => onAddRelation(selectedObject.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {getRelatedObjects().map(relation => (
                  <div key={relation.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      relation.direction === 'outgoing' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {relation.property?.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {relation.direction === 'outgoing' ? 'to' : 'from'} {relation.relatedObject?.name}
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => onDelete(relation.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
                
                {getRelatedObjects().length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No relations defined</p>
                  </div>
                )}
              </div>
            </div>

            {/* Class Hierarchy */}
            {isClass && selectedObject.parentClass && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Inheritance</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600">Extends:</div>
                  <div className="font-medium text-gray-900 mt-1">
                    {workspace.classes.find(c => c.id === selectedObject.parentClass)?.name || selectedObject.parentClass}
                  </div>
                </div>
              </div>
            )}

            {/* Instance Class */}
            {isInstance && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Instance Of</h4>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-900">
                    {workspace.classes.find(c => c.id === selectedObject.classId)?.name || selectedObject.classId}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Action */}
            {isEditMode && (
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => onDelete(selectedObject.id)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <Trash2 size={16} />
                  <span>Delete {getObjectType()}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database size={24} className="text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Select a Node</h4>
              <p className="text-sm">Click on a node in the graph to view and edit its properties.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}