import IUser from "../IUser";

export interface UserStore {
    user: Partial<IUser> | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: Partial<IUser> , token: string) => void;
    logout: () => void;
    setUser: (user: Partial<IUser>  | null) => void;
    setToken: (token: string | null) => void;
  }