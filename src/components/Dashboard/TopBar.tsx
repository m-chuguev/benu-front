import { Edit3 } from 'lucide-react';
import {TboxGraph} from "../../api";

export default function TopBar({isEditMode, selectedTBox}: {isEditMode: boolean, selectedTBox?: TboxGraph}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-2 group flex-1">
              <h1 className="text-2xl font-bold text-gray-900 min-w-0 truncate">
                {selectedTBox?.tboxKey}
              </h1>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="flex items-start space-x-2 group flex-1">
              <p className="text-gray-600 min-w-0 flex-1">
                Add a description...
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-6">
          <button
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