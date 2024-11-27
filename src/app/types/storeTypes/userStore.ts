import IUser from "../IUser";

export interface UserStore {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    setUser: (user: IUser | null) => void;
    setToken: (token: string | null) => void;
  }