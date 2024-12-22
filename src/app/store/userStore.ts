// import { create } from 'zustand';
// import IUser from '@/app/types/IUser';
// import { UserStore } from '../types/storeTypes/userStore';
// import { verifyToken } from '../lib/tokenConfig/verifyToken';

// export const useUserStore = create<UserStore>((set) => {

//   const checkToken = async (token: string | null) => {
//     if (token && await verifyToken(token)) {
//       return true;
//     }
//     return false;
//   };


//   const tokenFromCookie = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('token='))
//     ?.split('=')[1];


//   const initializeAuth = async () => {
//     const isAuthenticated = tokenFromCookie ? await checkToken(tokenFromCookie) : false;
//     set({
//       isAuthenticated,
//     });
//   };

//   initializeAuth();


//   return {
//     user: null,
//     isAuthenticated: false,


//     login: (user: Partial<IUser>, token: string) => {
//       if (checkToken(token)) {
//         set({
//           user: user,
//           isAuthenticated: true,
//         });
//       }
//     },

//     logout: () => {
//       set({
//         user: null,
//         isAuthenticated: false,
//       });
//       // Clear cookies or localStorage here
//       document.cookie = 'token=; Max-Age=0; path=/';
//     },

//     setUser: (user: Partial<IUser> | null) => {
//       set({
//         user: user,
//       });
//     },
//   };
// });


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

    if (tokenFromCookie) {
      const res = await verifyToken(tokenFromCookie);
      if (res.isValid) {
        set({ isAuthenticated: true });

        // Extract user ID from the token and fetch user data
        const userId = res.decoded.userId
        const user = await getUserById(userId)
        set({ user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },

}));
