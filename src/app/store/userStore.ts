import {create} from 'zustand';
import IUser from '@/app/types/IUser'; // Assuming you have this type defined
import { UserStore } from '../types/storeTypes/userStore';



export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  // Login action: Sets user and token, and updates the authentication status
  login: (user: IUser, token: string) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
    // You can set the token and user to cookies or localStorage here
    document.cookie = `token=${token}; path=/`;
  },

  // Logout action: Clears user and token, and updates the authentication status
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    // Clear cookies or localStorage here
    document.cookie = 'token=; Max-Age=0; path=/';
  },

  // Set user directly
  setUser: (user: IUser | null) => set({ user }),

  // Set token directly
  setToken: (token: string | null) => set({ token }),
}));
