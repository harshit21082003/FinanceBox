export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user?: User;
  logout: () => void;
  login: (token: string) => void;
}

export interface User {
  email: string;
  _id: string;
}
