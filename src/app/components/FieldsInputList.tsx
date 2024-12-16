'use client'
import React, { useEffect } from "react";
import { FieldsInputListProps } from "../types/props/FieldProps";
import { FiTrash } from "react-icons/fi";
import useFieldsDataStore from "../store/fieldsStore";


const FieldsInputList: React.FC<FieldsInputListProps> = ({ fields, setFields }) => {


    const { fieldsData, fetchFieldsData, setFieldsData } = useFieldsDataStore();

    useEffect(() => {
        const savedFields = JSON.parse(localStorage.getItem('fieldsData') || '[]');
        if (savedFields.length > 0) {
            setFieldsData(savedFields);
        } else {
            fetchFieldsData();
        }
    }, [fetchFieldsData, setFieldsData]);

    console.log('Current fields in store:', fieldsData);


    // יש פילדס שמכיל את המידע ויש את פילדס דאטה שממנו אנחנו מקבלים את המידע-עוד מעט נעשה אותו מהשרת ודיבי. כרגע זה המידע שלי.
    //יש הבדל משמעותי בין הסוג של פילד טו דיבי שמכיל מערך סטרינגים בסאב לבין פילדס לבד שמכיל סאבפילד שהוא סטרינג  

    const handleMainFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].mainField = value;
        updatedFields[index].subField = ""; // Reset subField when mainField changes
        setFields(updatedFields); // עדכון המערך ב-RHF
    };

    const handleSubFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].subField = value;
        setFields(updatedFields); // עדכון המערך ב-RHF
    };

    const addField = () => {
        setFields([...fields, { mainField: "", subField: "" }]); // הוספת שדה חדש
    };

    const removeField = (index: number) => {
        if (confirm("Are you sure you want to remove this field?")) {
        const updatedFields = [...fields]; // יצירת עותק של המערך הנוכחי
        updatedFields.splice(index, 1); // הסרת השדה במיקום הנבחר
        setFields(updatedFields); // עדכון המצב ב-RHF
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">

            <label className="block font-medium">הכנס תחומי עניין</label>

            {fields.map((field, index) => (
                <div key={index} className="flex flex-col space-y-2 mb-4">
                    <div>
                        <label htmlFor={`mainField-${index}`} className="block font-medium">
                            Main Field
                        </label>
                        <select
                            id={`mainField-${index}`}
                            value={field.mainField}
                            onChange={(e) => handleMainFieldChange(index, e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                        >
                            <option value="">Select Main Field</option>
                            {fieldsData.map((f) => (
                                <option key={f.mainField} value={f.mainField}>
                                    {f.mainField}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`subField-${index}`} className="block font-medium">
                            Sub Field
                        </label>
                        <select
                            id={`subField-${index}`}
                            value={field.subField}
                            onChange={(e) => handleSubFieldChange(index, e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            disabled={!field.mainField}
                        >
                            <option value="">Select Sub Field</option>
                            {(() => {
                                const subFields = fieldsData.find((f) => f.mainField === field.mainField)?.subFields;
                                return subFields
                                    ? subFields.map((sub) => (
                                        <option key={sub} value={sub}>
                                            {sub}
                                        </option>
                                    ))
                                    : (<option value="" disabled>
                                        No subfields available
                                    </option>
                                    );
                            })()}


                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="bg-gray-500 text-white px-3 py-1 rounded self-start"
                    >
                        <FiTrash className="mr-2" />

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
