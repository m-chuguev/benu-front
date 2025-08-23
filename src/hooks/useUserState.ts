import { useState, useEffect } from 'react';
import { User, UserState } from '../types/user';

// Simulated user for demo purposes
const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@openontology.com',
  createdAt: new Date(),
  lastLoginAt: new Date()
};

export const useUserState = () => {
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    user: null,
    isFirstTime: true
  });

  // Check if user has been here before (simple localStorage check)
  useEffect(() => {
    const hasVisited = localStorage.getItem('openontology_visited');
    const userData = localStorage.getItem('openontology_user');
    
    if (hasVisited && userData) {
      // Returning user
      setUserState({
        isAuthenticated: true,
        user: JSON.parse(userData),
        isFirstTime: false
      });
    }
  }, []);

  const authenticateUser = () => {
    // For demo, just simulate authentication
    const userWithDates = {
      ...DEMO_USER,
      createdAt: new Date(DEMO_USER.createdAt),
      lastLoginAt: new Date()
    };

    setUserState({
      isAuthenticated: true,
      user: userWithDates,
      isFirstTime: !localStorage.getItem('openontology_visited')
    });

    // Store in localStorage for persistence
    localStorage.setItem('openontology_visited', 'true');
    localStorage.setItem('openontology_user', JSON.stringify(userWithDates));
  };

  const markAsExperienced = () => {
    setUserState(prev => ({
      ...prev,
      isFirstTime: false
    }));
  };

  return {
    userState,
    authenticateUser,
    markAsExperienced
  };
};
