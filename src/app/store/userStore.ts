import {create} from 'zustand';
import IUser from '@/app/types/IUser'; 
import { UserStore } from '../types/storeTypes/userStore';
import { verifyToken } from '../lib/tokenConfig/verifyToken';


export const useUserStore = create<UserStore>(
  
    (set) => ({
  user: null,
  token: null,
  isAuthenticated:false,
  
  // Login action: Sets user and token, and updates the authentication status
  login: (user: Partial<IUser>, token: string) => {
    const decodedToken = verifyToken(token); // מוודא שהטוקן תקף
    set({
      user: decodedToken ? user : null, // אם הטוקן תקף, שומר את המשתמש
      token: decodedToken ? token : null, // שומר את הטוקן אם הוא תקף
      isAuthenticated: !!decodedToken, // מחזיר true אם הטוקן תקף, אחרת false
    });
    if (decodedToken) {
      console.log("מאומת מאומת מאומת");
      
      document.cookie = `token=${token}; path=/`; // שומר את הטוקן בעוגיה
    }
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
  setUser: (user: Partial<IUser> | null) =>{ 
    set((state) => {
      console.log("State before update:", state.user);
      console.log("User being set:", user);
    
      return { user };
    });
  },

  // Set token directly
  setToken: (token: string | null) => set({ token }),
})
);
