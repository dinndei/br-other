import {create} from 'zustand';
import { DataStore } from '../types/storeTypes/fieldsStore';

const useDataStore = create<DataStore>((set) => {
    const savedFields = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('fields') || '[]') : [];

    return {
        fields: savedFields,
        loading: false,
        setFields: (fields) => {
          set({ fields });
          localStorage.setItem('fields', JSON.stringify(fields)); 
        },
        setLoading: (loading) => set({ loading }),
      };
    });
export default useDataStore;
