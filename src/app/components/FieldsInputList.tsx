<<<<<<< HEAD
import React from "react";
import IFieldToDB from "@/app/types/IFieldToDB";
import { FieldsInputListProps } from "../types/props/FieldProps";

const FieldsInputList: React.FC<FieldsInputListProps> = ({ fields, setFields }) => {
    // נתוני דוגמה עבור fieldsData
    const fieldsData: Partial< IFieldToDB>[] = [
        { mainField: "Technology", subFields: ["AI", "Web Development", "Cybersecurity"] },
        { mainField: "Health", subFields: ["Nutrition", "Mental Health", "Fitness"] },
        { mainField: "Education", subFields: ["Math", "Science", "History"] },
    ];

    const handleMainFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].mainField = value;
        updatedFields[index].subField = ""; // Reset subField when mainField changes
        setFields(updatedFields);
    };

    const handleSubFieldChange = (index: number, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index].subField = value;
        setFields(updatedFields);
    };
=======
// import React from "react";
// import IField from "@/app/types/IField";
// import { FieldsInputListProps } from "../types/props/FieldProps";

// const FieldsInputList: React.FC<FieldsInputListProps> = ({ fields, setFields }) => {
  
//     const handleInputChange = (index: number, key: keyof IField, value: string) => {
//         const updatedFields = [...fields];
//         updatedFields[index][key] = value;
//         setFields(updatedFields);
//     };
>>>>>>> e50cd01c54afc5ce1be96929799031c1495d179a

//     const addField = () => {
//         setFields([...fields, { mainField: "", subField: "" }]);
//     };

//     const removeField = (index: number) => {
//         const updatedFields = fields.filter((_, i) => i !== index);
//         setFields(updatedFields);
//     };

<<<<<<< HEAD
    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <label className="block font-medium">הכנס תחומי עניין</label>
            {fields.map((field, index) => (
                <div key={index} className="flex flex-col space-y-2 mb-4">
                    {/* Main Field Selection */}
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

                    {/* Sub Field Selection */}
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
                            {fieldsData
                                .find((f) => f.mainField === field.mainField)
                                ?.subFields.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Remove Field Button */}
                    <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded self-start"
                    >
                        Remove
                    </button>
                </div>
            ))}

            {/* Add Field Button */}
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
=======
//     return (
//         <div className="max-w-md mx-auto p-4 space-y-4">
//         <label className="block font-medium">הכנס תחומי עניין</label>
//         {fields.map((field, index) => (
//             <div key={index} className="flex space-x-2 mb-2">
//                 <input
//                     type="text"
//                     value={field.mainField}
//                     onChange={(e) => handleInputChange(index, "mainField", e.target.value)}
//                     className="w-1/2 border border-gray-300 p-2 rounded"
//                     placeholder="Main Field"
//                 />
//                 <input
//                     type="text"
//                     value={field.subField}
//                     onChange={(e) => handleInputChange(index, "subField", e.target.value)}
//                     className="w-1/2 border border-gray-300 p-2 rounded"
//                     placeholder="Sub Field"
//                 />
//                 <button
//                     type="button"
//                     onClick={() => removeField(index)}
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                     Remove
//                 </button>
//             </div>
//         ))}
//         <button
//             type="button"
//             onClick={addField}
//             className="bg-gray-400 text-white px-3 py-1 rounded"
//         >
//             + 
//         </button>
//     </div>
//     );
// };
>>>>>>> e50cd01c54afc5ce1be96929799031c1495d179a

// export default FieldsInputList;
