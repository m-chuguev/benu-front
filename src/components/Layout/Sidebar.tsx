import { FolderOpen, Plus, Database } from 'lucide-react';
import {useRepositoriesQuery} from "../../hooks/useRepositoriesQuery.ts";
import {useEffect} from "react";
import {useRepoStore} from "../../store/repo.store.ts";
import {useTBoxesQuery} from "../../hooks/useTBoxesQuery.ts";
import {useTBoxesStore} from "../../store/tBoxes.store.ts";

interface SidebarProps {
  onCreateTBox: () => void;
}

export default function Sidebar({ onCreateTBox }: SidebarProps) {
  const { data: repositories } = useRepositoriesQuery();
  const {selectedRepositoryId, setSelectedRepositoryId} = useRepoStore();
  const { data:tBoxes, isLoading } = useTBoxesQuery(selectedRepositoryId);
  const {selectedTBoxId, setSelectedTBoxId} = useTBoxesStore();

  useEffect(() => {
    if (repositories?.length) {
      setSelectedRepositoryId(repositories[0].id)
    }
  }, [repositories]);

  useEffect(() => {
    if(tBoxes?.length) {
      setSelectedTBoxId(tBoxes[0].tboxKey)
    }
  }, [tBoxes]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">OpenOntology</h1>
          </div>
        </div>
        <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedRepositoryId ?? ''}
            onChange={(event) => {
              setSelectedRepositoryId(event.target.value)
            }}
        >
          <option value="" disabled>
            Select Repository
          </option>
          {repositories?.map((repository) => (
              <option key={repository.id} value={repository.id}>
                {repository.title}
              </option>
          ))}
        </select>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">T-Boxes</h2>
          <button
            onClick={onCreateTBox}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1 relative">
          {isLoading && (<div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"/>
              <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>)}
          <div className={isLoading ? "opacity-20" : ''}>
            {tBoxes?.map((tBox) => (
                <button
                    key={tBox.tboxKey}
                    onClick={() => setSelectedTBoxId(tBox.tboxKey)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTBoxId === tBox.tboxKey
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen size={16} className={
                      selectedTBoxId === tBox.tboxKey ? 'text-blue-600' : 'text-gray-500'
                    }/>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{tBox.label ?? tBox.tboxKey}</div>
                    </div>
                  </div>
                </button>
            ))}

          </div>
        </div>

        {tBoxes?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen size={24} className="mx-auto mb-2 text-gray-400"/>
              <p className="text-sm mb-2">No TBoxes</p>
              <button
                  onClick={onCreateTBox}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create first tBox
              </button>
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
            onClick={onCreateTBox}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16}/>
          <span>New TBox</span>
        </button>
      </div>
    </div>
  );
}