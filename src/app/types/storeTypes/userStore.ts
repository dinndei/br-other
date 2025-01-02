import IUser from "../IUser";

export interface UserStore {
  user: Partial<IUser> | null;
  isAuthenticated: boolean;
  login: (user: Partial<IUser>, token: string) => void;
  logout: () => void;
  setUser: (user: Partial<IUser> | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}