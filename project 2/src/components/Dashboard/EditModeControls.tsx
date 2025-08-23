import React from 'react';
import { Save, X, Undo, Edit3 } from 'lucide-react';

interface EditModeControlsProps {
  isEditMode: boolean;
  hasChanges: boolean;
  canUndo: boolean;
  onEnterEditMode: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUndo: () => void;
}

export default function EditModeControls({
  isEditMode,
  hasChanges,
  canUndo,
  onEnterEditMode,
  onSave,
  onCancel,
  onUndo
}: EditModeControlsProps) {
  if (!isEditMode) {
    return (
      <button
        onClick={onEnterEditMode}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Edit3 size={16} />
        <span>Edit Mode</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onSave}
        disabled={!hasChanges}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          hasChanges 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Save size={16} />
        <span>Save</span>
      </button>
      <button
        onClick={onCancel}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        <X size={16} />
        <span>Cancel</span>
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          canUndo 
            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Undo size={16} />
        <span>Undo</span>
      </button>
    </div>
  );
}