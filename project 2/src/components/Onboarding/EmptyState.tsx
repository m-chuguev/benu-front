import React from 'react';
import { Network, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateWorkspace: () => void;
}

export default function EmptyState({ onCreateWorkspace }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Network size={32} className="text-gray-400" />
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          You don't have any workspaces yet
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Create your first workspace to start building knowledge graphs and managing ontologies.
        </p>

        {/* Primary Button */}
        <button
          onClick={onCreateWorkspace}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Create Workspace</span>
        </button>
      </div>
    </div>
  );
}