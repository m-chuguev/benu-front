import React, { useState, useEffect } from 'react';
import { Workspace } from './types/ontology';
import { mockWorkspaces } from './data/mockData';
import { useUserState } from './hooks/useUserState';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmptyState from './components/Onboarding/EmptyState';
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import CreateWorkspaceModal from './components/Modals/CreateWorkspaceModal';

function App() {
  const { userState, authenticateUser, markAsExperienced } = useUserState();
  
  // Initialize workspaces based on user state
  const getInitialWorkspaces = (): Workspace[] => {
    // Check if user has existing workspaces in localStorage
    const savedWorkspaces = localStorage.getItem('openontology_workspaces');
    if (userState.isAuthenticated && savedWorkspaces) {
      try {
        return JSON.parse(savedWorkspaces);
      } catch {
        // If parsing fails, return empty array
        return [];
      }
    }
    // All users (new and returning without saved workspaces) start empty
    return [];
  };

  const [workspaces, setWorkspaces] = useState<Workspace[]>(getInitialWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Update workspaces when user state changes
  useEffect(() => {
    const newWorkspaces = getInitialWorkspaces();
    setWorkspaces(newWorkspaces);
    
    // Set active workspace for returning users
    if (userState.isAuthenticated && !userState.isFirstTime && newWorkspaces.length > 0) {
      setActiveWorkspaceId(newWorkspaces[0].id);
    } else {
      setActiveWorkspaceId(null);
    }
  }, [userState.isAuthenticated, userState.isFirstTime]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  const handleGetStarted = () => {
    authenticateUser();
    markAsExperienced();
  };

  const handleCreateWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
  };

  const handleCreateManual = (name: string, description: string) => {
    // Authenticate user if they're not already
    if (!userState.isAuthenticated) {
      authenticateUser();
    }

    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      classes: [],
      properties: [],
      instances: [],
      relations: []
    };
    
    const updatedWorkspaces = [...workspaces, newWorkspace];
    setWorkspaces(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
    setActiveWorkspaceId(newWorkspace.id);
    setShowCreateModal(false);
    markAsExperienced();
  };

  const handleCreateFromFile = (file: File, name: string, description: string) => {
    // Authenticate user if they're not already
    if (!userState.isAuthenticated) {
      authenticateUser();
    }

    // Simulate file processing - in real app, this would parse the file
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      classes: [
        {
          id: 'imported-1',
          name: 'ImportedClass',
          description: 'Class imported from file',
          properties: [],
          type: 'tbox',
          position: { x: 200, y: 150 }
        }
      ],
      properties: [
        {
          id: 'imported-p1',
          name: 'importedProperty',
          description: 'Property imported from file',
          domain: 'imported-1',
          range: 'string',
          type: 'tbox'
        }
      ],
      instances: [],
      relations: []
    };
    
    const updatedWorkspaces = [...workspaces, newWorkspace];
    setWorkspaces(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
    setActiveWorkspaceId(newWorkspace.id);
    setShowCreateModal(false);
    markAsExperienced();
  };

  // Save workspaces to localStorage
  const saveWorkspaces = (workspaceList: Workspace[]) => {
    localStorage.setItem('openontology_workspaces', JSON.stringify(workspaceList));
  };

  const handleWorkspaceChange = (updatedWorkspace: Workspace) => {
    const updatedWorkspaces = workspaces.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w);
    setWorkspaces(updatedWorkspaces);
    saveWorkspaces(updatedWorkspaces);
  };

  // Show welcome screen for first-time users
  if (!userState.isAuthenticated || userState.isFirstTime) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceSelect={handleWorkspaceSelect}
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