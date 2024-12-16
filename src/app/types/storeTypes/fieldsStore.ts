import IFieldToDB from "../IFieldToDB";

export interface DataStore {
    fieldsData: IFieldToDB[]; // נתונים שמגיעים ממונגו
    loading: boolean;
    setFieldsData: (fields: IFieldToDB[]) => void;
    setLoading: (loading: boolean) => void;
    fetchFieldsData: () => Promise<IFieldToDB[]>;
}