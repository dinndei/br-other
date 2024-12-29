'use client';
import React, { useEffect, useState } from "react";
import { FieldsInputListProps } from "../types/props/FieldProps";
import { FiTrash } from "react-icons/fi";
import useFieldsDataStore from "../store/fieldsStore";

const FieldsInputList: React.FC<FieldsInputListProps> = ({ fields, setFields, showEditButtons }) => {
    const { fieldsData, fetchFieldsData, setFieldsData } = useFieldsDataStore();
    const [filteredMainFields, setFilteredMainFields] = useState<string[]>([]);
    const [filteredSubFields, setFilteredSubFields] = useState<string[]>([]);
    const [showMainOptions, setShowMainOptions] = useState<boolean[]>([]);
    const [showSubOptions, setShowSubOptions] = useState<boolean[]>([]);

    useEffect(() => {
        const savedFields = JSON.parse(localStorage.getItem("fieldsData") || "[]");
        if (savedFields.length > 0) {
            setFieldsData(savedFields);
        } else {
            fetchFieldsData();
        }
    }, [fetchFieldsData, setFieldsData]);

    const handleMainFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].mainField = value;
        updatedFields[index].subField = ""; // Reset subField when mainField changes
        setFields(updatedFields);
        setShowMainOptions((prev) => {
            const newOptions = [...prev];
            newOptions[index] = false; // Hide options after selection
            return newOptions;
        });
    };

    const handleSubFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].subField = value;
        setFields(updatedFields);
        setShowSubOptions((prev) => {
            const newOptions = [...prev];
            newOptions[index] = false; // Hide options after selection
            return newOptions;
        });
    };

    const handleMainFieldSearch = (index: number, search: string) => {
        const filtered = fieldsData
            .map((f) => f.mainField)
            .filter((field) => field.toLowerCase().includes(search.toLowerCase()));
        setFilteredMainFields(filtered);
        setShowMainOptions((prev) => {
            const newOptions = [...prev];
            newOptions[index] = true; // Show options while searching
            return newOptions;
        });
    };

    const handleSubFieldSearch = (index: number, search: string, mainField: string) => {
        const subFields = fieldsData.find((f) => f.mainField === mainField)?.subFields || [];
        const filtered = subFields.filter((sub) => sub.toLowerCase().includes(search.toLowerCase()));
        setFilteredSubFields(filtered);
        setShowSubOptions((prev) => {
            const newOptions = [...prev];
            newOptions[index] = true; // Show options while searching
            return newOptions;
        });
    };

    const addField = () => {
        setFields([...fields, { mainField: "", subField: "" }]);
        setShowMainOptions([...showMainOptions, false]);
        setShowSubOptions([...showSubOptions, false]);
    };

    const removeField = (index: number) => {
        if (confirm("Are you sure you want to remove this field?")) {
            const updatedFields = [...fields];
            updatedFields.splice(index, 1);
            setFields(updatedFields);
            setShowMainOptions((prev) => prev.filter((_, i) => i !== index));
            setShowSubOptions((prev) => prev.filter((_, i) => i !== index));
        }
    };

   
    return (
        <div className="max-w-md mx-auto p-4 space-y-0"> 
            <label className="block font-medium">הכנס תחומי עניין</label>
            {fields.map((field, index) => (
                <div key={index} className="flex flex-col space-y-0 mb-0"> 
                    <div className="mb-2"> 
                        <label htmlFor={`mainField-${index}`} className="block font-medium">
                            Main Field
                        </label>
                        <input
                            id={`mainField-${index}`}
                            value={field.mainField}
                            onChange={(e) => {
                                handleMainFieldChange(index, e.target.value);
                                handleMainFieldSearch(index, e.target.value);
                            }}
                            placeholder="Type to search..."
                            className="w-full border border-gray-300 p-2 rounded text-black"
                        />
                        {showMainOptions[index] && filteredMainFields.length > 0 && (
                            <ul className="bg-white border border-gray-300 rounded mt-2 max-h-32 overflow-y-auto">
                                {filteredMainFields.map((mainField) => (
                                    <li
                                        key={mainField}
                                        className="p-2 text-black hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleMainFieldChange(index, mainField)}
                                    >
                                        {mainField}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-2"> 
                        <label htmlFor={`subField-${index}`} className="block font-medium">
                            Sub Field
                        </label>
                        <input
                            id={`subField-${index}`}
                            value={field.subField}
                            onChange={(e) => {
                                handleSubFieldChange(index, e.target.value);
                                handleSubFieldSearch(index, e.target.value, field.mainField);
                            }}
                            placeholder="Type to search..."
                            className="w-full text-black border border-gray-300 p-2 rounded"
                            disabled={!field.mainField}
                        />
                        {showSubOptions[index] && filteredSubFields.length > 0 && (
                            <ul className="bg-white border border-gray-300 rounded mt-2 max-h-32 overflow-y-auto">
                                {filteredSubFields.map((subField) => (
                                    <li
                                        key={subField}
                                        className="p-2 text-black hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSubFieldChange(index, subField)}
                                    >
                                        {subField}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {showEditButtons && (
                        <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="bg-gray-500 text-white px-3 py-1 rounded self-start"
                        >
                            <FiTrash className="mr-2" />
                        </button>
                    )}
                </div>
            ))}
            {showEditButtons && (
                <button
                    type="button"
                    onClick={addField}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                    +
                </button>
            )}
        </div>
    );

};

export default FieldsInputList;
