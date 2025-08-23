export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  isFirstTime: boolean;
}
