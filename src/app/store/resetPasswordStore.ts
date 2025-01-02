import { create } from 'zustand';
import { UserForResetStore } from '../types/storeTypes/usernameForReset';


export const useUserForResetStore = create<UserForResetStore>((set) => ({
    usernameForReset: null,
    setUsernameForReset: (usernameForReset) => set({ usernameForReset: usernameForReset }),
    emailForReset: null,
    setEmailForReset: (emailForReset) => set({ emailForReset: emailForReset })
}));