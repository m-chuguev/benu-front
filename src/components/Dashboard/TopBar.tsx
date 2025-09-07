import React, { useState } from 'react';
import { Brain, Edit3, Edit2, Check, X } from 'lucide-react';
import { Workspace } from '../../types/ontology';

interface TopBarProps {
  workspace: Workspace;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onToggleAI: () => void;
  onUpdateWorkspace: (updates: { name?: string; description?: string }) => void;
}

export default function TopBar({ 
  workspace, 
  isEditMode, 
  onToggleEditMode, 
  onToggleAI,
  onUpdateWorkspace 
}: TopBarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempName, setTempName] = useState(workspace.title);
  const [tempDescription, setTempDescription] = useState(workspace.description || '');

  const handleSaveName = () => {
    if (tempName.trim() && tempName !== workspace.title) {
      onUpdateWorkspace({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(workspace.title);
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    if (tempDescription !== workspace.description) {
      onUpdateWorkspace({ description: tempDescription.trim() });
    }
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(workspace.description || '');
    setIsEditingDescription(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelName();
    }
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      handleCancelDescription();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Editable Title */}
          <div className="flex items-center space-x-2 mb-2">
            {isEditingName ? (
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleSaveName}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1 min-w-0"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelName}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 group flex-1">
                <h1 className="text-2xl font-bold text-gray-900 min-w-0 truncate">
                  {workspace.title}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Editable Description */}
          <div className="flex items-start space-x-2">
            {isEditingDescription ? (
              <div className="flex items-start space-x-2 flex-1">
                <textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyPress}
                  onBlur={handleSaveDescription}
                  placeholder="Add a description..."
                  className="text-gray-600 bg-transparent border-b-2 border-blue-500 focus:outline-none resize-none flex-1 min-w-0"
                  rows={1}
                  autoFocus
                />
                <button
                  onClick={handleSaveDescription}
                  className="p-1 text-green-600 hover:text-green-700 mt-1"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelDescription}
                  className="p-1 text-gray-400 hover:text-gray-600 mt-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-start space-x-2 group flex-1">
                <p className="text-gray-600 min-w-0 flex-1">
                  {workspace.description || 'Add a description...'}
                </p>
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 ml-6">
          <button
            onClick={onToggleAI}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Brain size={16} />
            <span>Ask AI</span>
          </button>
          
          <button
            onClick={onToggleEditMode}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Edit3 size={16} />
            <span>{isEditMode ? 'Exit Edit' : 'Edit Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}