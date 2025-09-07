import { useState, useEffect } from 'react';
import {
  TBox,
  UploadPreview
} from './types/ontology';
import { useUserState } from './hooks/useUserState';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmptyState from './components/Onboarding/EmptyState';
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import CreateWorkspaceModal from './components/Modals/CreateWorkspaceModal';
import {GraphDbRepositoriesService} from "./api";

function App() {
  const { userState, authenticateUser, markAsExperienced } = useUserState();

  const [activeRepositoryId, setActiveRepositoryId] = useState<string | null>(null);
  const [tBoxes, setTBoxes] = useState<TBox[]>([]);
  const [activeTBoxId, setActiveTBoxId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (activeRepositoryId) {
      GraphDbRepositoriesService.listTboxes(activeRepositoryId).then((response) => {
        const workspaces = response.map(r => ({
          ...r,
          id: r.tboxKey,
          title: r.tboxKey,
          classes: [],
          properties: [],
          instances: [],
          relations: [],
        }))
        setTBoxes(workspaces)

        if (workspaces.length > 0) {
          setActiveTBoxId(workspaces[0].id)
        }
      })
    }
  }, [activeRepositoryId]);

  const activeWorkspace = tBoxes.find(w => w.id === activeTBoxId);

  const handleGetStarted = () => {
    authenticateUser();
    markAsExperienced();
  };

  const handleCreateWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleCreateManual = (name: string, description: string) => {
    if (!userState.isAuthenticated) {
      authenticateUser();
    }

    const newWorkspace: TBox = {
      id: Date.now().toString(),
      title: name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      classes: [],
      properties: [],
      instances: [],
      relations: []
    };
    
    const updatedWorkspaces = [...tBoxes, newWorkspace];
    setTBoxes(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
    setActiveTBoxId(newWorkspace.id);
    setShowCreateModal(false);
    markAsExperienced();
  };

  const handleCreateFromFile = (preview: UploadPreview, name: string, description: string) => {
    // Authenticate user if they're not already
    if (!userState.isAuthenticated) {
      authenticateUser();
    }

    // Create workspace from preview data
    const newWorkspace: TBox = {
      id: Date.now().toString(),
      title: name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      classes: preview.classes,
      properties: preview.properties,
      instances: preview.instances,
      relations: preview.relations
    };
    
    const updatedWorkspaces = [...tBoxes, newWorkspace];
    setTBoxes(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
    setActiveTBoxId(newWorkspace.id);
    setShowCreateModal(false);
    markAsExperienced();
  };

  // Save tBoxes to localStorage
  const saveWorkspaces = (workspaceList: TBox[]) => {
    localStorage.setItem('openontology_workspaces', JSON.stringify(workspaceList));
  };

  const handleWorkspaceChange = (updatedWorkspace: TBox) => {
    const updatedWorkspaces = tBoxes.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w);
    setTBoxes(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
  };

  // Show welcome screen for first-time users
  if (!userState.isAuthenticated || userState.isFirstTime) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
          setActiveRepositoryId={setActiveRepositoryId}
        workspaces={tBoxes}
        activeWorkspaceId={activeTBoxId}
        onTBoxSelect={(tBoxId: string) => setActiveTBoxId(tBoxId)}
        onCreateWorkspace={handleCreateWorkspace}
      />
      
      {activeWorkspace ? (
        <div className="flex-1 flex flex-col">
          <Dashboard
            workspace={activeWorkspace}
            onWorkspaceChange={handleWorkspaceChange}
          />
        </div>
      ) : (
        <EmptyState onCreateWorkspace={handleCreateWorkspace} />
      )}

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateManual={handleCreateManual}
        onCreateFromFile={handleCreateFromFile}
      />
    </div>
  );
}

export default App;