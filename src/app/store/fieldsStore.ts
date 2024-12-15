
import { create } from 'zustand';
import axios from 'axios';
import { DataStore } from '../types/storeTypes/fieldsStore';

const useDataStore = create<DataStore>((set, get) => {
  return {
    fields: [],
    loading: false,

    setFields: (fields) => {
      set({ fields });
      localStorage.setItem('fields', JSON.stringify(fields)); 
    },

    setLoading: (loading) => set({ loading }),

    fetchFields: async () => {
      const { fields } = get();

      if (fields.length > 0) return fields;

      const savedFields = JSON.parse(localStorage.getItem('fields') || '[]');
      if (savedFields.length > 0) {
        set({ fields: savedFields });
        return savedFields;
      }

      try {
        set({ loading: true });
        const response = await axios.get('../../api/fields/getAllFields');
        if (!response.data.fields) throw new Error('No fields found in server response');
        const data = response.data.fields;

        set({ fields: data, loading: false });
        localStorage.setItem('fields', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error fetching fields:', error);
        set({ loading: false });
        return [];
      }
    },
  };
});

export default useDataStore;

