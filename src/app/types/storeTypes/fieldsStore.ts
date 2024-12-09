import IFieldToDB from "../IFieldToDB";

export interface DataStore {
    fields: IFieldToDB[]; // נתונים שמגיעים ממונגו
    loading: boolean;
    setFields: (fields: IFieldToDB[]) => void;
    setLoading: (loading: boolean) => void;
}