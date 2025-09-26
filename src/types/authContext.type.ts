import { LoginCredentials, User } from "./auth.type";

export interface IAuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  _error: string | null;
  isAuthenticated: boolean;
};