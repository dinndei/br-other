import {create} from 'zustand';
import {UserForResetStore } from '../types/storeTypes/usernameForReset';


export const useUserForResetStore = create<UserForResetStore>((set) => ({
    usernameForReset: null, // ערך ברירת המחדל
    setUsernameForReset: (usernameForReset) => set({ usernameForReset: usernameForReset }),
    emailForReset: null, // ערך ברירת המחדל
    setEmailForReset: (emailForReset) => set({ emailForReset: emailForReset })
}));