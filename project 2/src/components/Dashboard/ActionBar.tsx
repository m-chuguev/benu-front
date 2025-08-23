import React from 'react';
import { Plus, Upload, RefreshCw, CheckCircle, Database } from 'lucide-react';
import EditModeControls from './EditModeControls';

interface ActionBarProps {
  onAddClass: () => void;
  onAddInstance: () => void;
  onUploadABox: () => void;
  onUpdateOntology: () => void;
  onRunValidation: () => void;
  isEditMode: boolean;
  hasChanges: boolean;
  canUndo: boolean;
  onEnterEditMode: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUndo: () => void;
}

export default function ActionBar({ 
  onAddClass,
  onAddInstance,
  onUploadABox,
  onUpdateOntology,
  onRunValidation,
  isEditMode,
  hasChanges,
  canUndo,
  onEnterEditMode,
  onSave,
  onCancel,
  onUndo
}: ActionBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Main Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onAddClass}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={16} />
            <span>Add Class</span>
          </button>
          
          <button
            onClick={onAddInstance}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={16} />
            <span>Add Instance</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            onClick={onUploadABox}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            <Database size={16} />
            <span>Upload A-Box</span>
          </button>
          
          <button
            onClick={onUpdateOntology}
            className="flex items-center space-x-2 px-4 py-2.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors font-medium"
          >
            <RefreshCw size={16} />
            <span>Update Ontology</span>
          </button>
          
          <button
            onClick={onRunValidation}
            className="flex items-center space-x-2 px-4 py-2.5 bg-green-100 text-green-800 border border-green-200 rounded-lg hover:bg-green-200 transition-colors font-medium"
          >
            <CheckCircle size={16} />
            <span>Validate</span>
          </button>
        </div>

        {/* Edit Mode Controls */}
        <EditModeControls
          isEditMode={isEditMode}
          hasChanges={hasChanges}
          canUndo={canUndo}
          onEnterEditMode={onEnterEditMode}
          onSave={onSave}
          onCancel={onCancel}
          onUndo={onUndo}
        />
      </div>
    </div>
  );
}