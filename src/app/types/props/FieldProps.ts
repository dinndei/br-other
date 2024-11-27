import IField from "../IField";

export interface FieldsInputListProps {
    fields: IField[];
    setFields: React.Dispatch<React.SetStateAction<IField[]>>;
}
