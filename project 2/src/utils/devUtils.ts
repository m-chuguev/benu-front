// Development utilities for testing user flows

export const resetUserState = () => {
  localStorage.removeItem('openontology_visited');
  localStorage.removeItem('openontology_user');
  localStorage.removeItem('openontology_workspaces');
  window.location.reload();
};

export const loadDemoData = () => {
  import('../data/mockData').then(({ mockWorkspaces }) => {
    localStorage.setItem('openontology_workspaces', JSON.stringify(mockWorkspaces));
    window.location.reload();
  });
};

// Add global functions for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).resetUserState = resetUserState;
  (window as any).loadDemoData = loadDemoData;
}
