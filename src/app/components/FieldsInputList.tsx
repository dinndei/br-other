import React from "react";
import IField from "@/app/types/IField";
import { FieldsInputListProps } from "../types/props/FieldProps";

const FieldsInputList: React.FC<FieldsInputListProps> = ({ fields, setFields }) => {
  
    const handleInputChange = (index: number, key: keyof IField, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index][key] = value;
        setFields(updatedFields);
    };

    const addField = () => {
        setFields([...fields, { mainField: "", subField: "" }]);
    };

    const removeField = (index: number) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
        <label className="block font-medium">הכנס תחומי עניין</label>
        {fields.map((field, index) => (
            <div key={index} className="flex space-x-2 mb-2">
                <input
                    type="text"
                    value={field.mainField}
                    onChange={(e) => handleInputChange(index, "mainField", e.target.value)}
                    className="w-1/2 border border-gray-300 p-2 rounded"
                    placeholder="Main Field"
                />
                <input
                    type="text"
                    value={field.subField}
                    onChange={(e) => handleInputChange(index, "subField", e.target.value)}
                    className="w-1/2 border border-gray-300 p-2 rounded"
                    placeholder="Sub Field"
                />
                <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Remove
                </button>
            </div>
        ))}
        <button
            type="button"
            onClick={addField}
            className="bg-gray-400 text-white px-3 py-1 rounded"
        >
            + 
        </button>
    </div>
    );
};

export default FieldsInputList;
