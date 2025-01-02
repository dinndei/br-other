import { create } from 'zustand';
import { LearningRequestStore } from '../types/storeTypes/learningRequestStore';


export const useLearningRequestStore = create<LearningRequestStore>((set) => ({
    requesterId: null,
    setRequesterId: (requesterId) => set({ requesterId }),
    mainField: "",
    setMainField: (mainField) => set({ mainField }),
    subField: "",
    setSubField: (subField) => set({ subField }),
    createdAt: new Date(),
    setCreatedAt: (createdAt) => set({ createdAt }),
    expiresAt: new Date(),
    setExpiresAt: (expiresAt) => set({ expiresAt }),

}));