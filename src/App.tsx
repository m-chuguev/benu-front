import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmptyState from './components/Onboarding/EmptyState';
import CreateWorkspaceModal from './components/Modals/CreateWorkspaceModal';
import {useRepoStore} from "./store/repo.store.ts";
import {useTBoxesStore} from "./store/tBoxes.store.ts";

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {selectedRepositoryId} = useRepoStore();
  const {selectedTBoxId} = useTBoxesStore();

    const handleCreateTBox = () => {
        setShowCreateModal(true);
    };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onCreateTBox={handleCreateTBox}/>
      
      {selectedTBoxId ? (
        <div className="flex-1 flex flex-col">
          <Dashboard/>
        </div>
      ) : (
        <EmptyState onCreateWorkspace={handleCreateTBox} />
      )}

      <CreateWorkspaceModal
          activeRepositoryId={selectedRepositoryId}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

export default App;