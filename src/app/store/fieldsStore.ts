
import { create } from 'zustand';
import axios from 'axios';
import { DataStore } from '../types/storeTypes/fieldsStore';
import IFieldToDB from '../types/IFieldToDB';

const useFieldsDataStore = create<DataStore>((set, get) => {
  return {
    fieldsData: [],
    loading: false,

    setFieldsData: (fieldsData:IFieldToDB[]) => {
      set({ fieldsData });
      localStorage.setItem('fields', JSON.stringify(fieldsData)); 
    },

    setLoading: (loading) => set({ loading }),

    fetchFieldsData: async () => {
      const { fieldsData } = get();

      if (fieldsData.length > 0) return fieldsData;

      const savedFields = JSON.parse(localStorage.getItem('fields') || '[]');
      if (savedFields.length > 0) {
        set({ fieldsData: savedFields });
        return savedFields;
      }

      try {
        set({ loading: true });
        const response = await axios.get('../../api/fields/getAllFields');
        if (!response.data.fields) throw new Error('No fields found in server response');
        const data = response.data.fields;

        set({ fieldsData: data, loading: false });
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

export default useFieldsDataStore;

