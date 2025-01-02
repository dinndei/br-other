
export interface LearningRequestStore {
    requesterId: string | null;
    mainField: string;
    subField: string;
    createdAt: Date;
    expiresAt: Date;

    setRequesterId: (requesterId: string | null) => void;
    setMainField: (mainField: string) => void;
    setSubField: (subField: string) => void;
    setCreatedAt: (createdAt: Date) => void;
    setExpiresAt: (expiresAt: Date) => void;

}