import { create } from 'zustand';
import IUser from '@/app/types/IUser';
import { UserStore } from '../types/storeTypes/userStore';
import { verifyToken } from '../lib/tokenConfig/verifyToken';
import { getUserById } from '../actions/userActions';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (user: Partial<IUser>, token: string) => {
    if (await verifyToken(token)) {
      set({
        user: user,
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      
    });
    // Clear cookies or localStorage here
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear token from cookies
  },

  setUser: (user: Partial<IUser> | null) => {
    console.log("setUser called with:", user);

    set({
      user: user,
    });
    
  },

  setIsAuthenticated: (isAuthenticated: boolean) => {
    console.log("setIsAuthenticated called with:", isAuthenticated);

    set({
      isAuthenticated,
    });
  },

  initializeAuth: async () => {

    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];
console.log("t f c",tokenFromCookie);

    if (tokenFromCookie) {
      const res = await verifyToken(tokenFromCookie);
console.log("res",res);

      if (res.isValid) {
        set({ isAuthenticated: true });
        set({user:res.decoded.user});
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },

}));
