import React from 'react';
import { Workspace } from '../../types/ontology';
import { FolderOpen, Plus, Database } from 'lucide-react';

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceSelect: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
}

export default function Sidebar({ workspaces, activeWorkspaceId, onWorkspaceSelect, onCreateWorkspace }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">OpenOntology</h1>
          </div>
        </div>
      </div>

      {/* Workspaces */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">Workspaces</h2>
          <button
            onClick={onCreateWorkspace}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => onWorkspaceSelect(workspace.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeWorkspaceId === workspace.id
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FolderOpen size={16} className={
                  activeWorkspaceId === workspace.id ? 'text-blue-600' : 'text-gray-500'
                } />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{workspace.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {workspace.classes.length}C • {workspace.instances.length}I
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {workspaces.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-2">No workspaces</p>
            <button
              onClick={onCreateWorkspace}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create first workspace
            </button>
          </div>
        )}
      </div>

      {/* New Workspace Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onCreateWorkspace}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16} />
          <span>New Workspace</span>
        </button>
      </div>
    </div>
  );
}