import {create} from 'zustand';
import IUser from '@/app/types/IUser'; // Assuming you have this type defined
import { UserStore } from '../types/storeTypes/userStore';

import { Role } from '../types/enums/role';
import { Gender } from '../types/enums/gender';


export const useUserStore = create<UserStore>((set) => ({
  user: {
    "_id":"674592cb8beb04ea47fe4287",
    "firstName": "Estee",
    "lastName": "Frei",
    "userName": "Ef",
    "age": 21,
    "email": "e533@gmail.com",
    "password": "1234",
    "role":Role.User,
    "gender":Gender.Male,
    "fields":[{ "mainField": "teacher", "subField": "java" }]


},
  token: null,
  isAuthenticated: true,
  
  // Login action: Sets user and token, and updates the authentication status
  login: (user: Partial<IUser>, token: string) => {
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
  setUser: (user: Partial<IUser> | null) => set({ user }),

  // Set token directly
  setToken: (token: string | null) => set({ token }),
}));
