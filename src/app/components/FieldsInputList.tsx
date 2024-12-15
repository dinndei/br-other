'use client'
import React from "react";
import IFieldToDB from "@/app/types/IFieldToDB";
import { FieldsInputListProps } from "../types/props/FieldProps";
import IField from "../types/IField";
import { FiTrash } from "react-icons/fi";


const FieldsInputList: React.FC
//<FieldsInputListProps> 
    = (
   // { fields, setFields }
) => {

    const fieldsData: Partial<IFieldToDB>[] = [
        { mainField: "Technology", subFields: ["AI", "Web Development", "Cybersecurity"] },
        { mainField: "Health", subFields: ["Nutrition", "Mental Health", "Fitness"] },
        { mainField: "Education", subFields: ["Math", "Science", "History"] },
    ];
    const [fields, setFields] = React.useState<IField[]>([{ mainField: "", subField: "" }]);
  
   
// יש פילדס שמכיל את המידע ויש את פילדס דאטה שממנו אנחנו מקבלים את המידע-עוד מעט נעשה אותו מהשרת ודיבי. כרגע זה המידע שלי.
//יש הבדל משמעותי בין הסוג של פילד טו דיבי שמכיל מערך סטרינגים בסאב לבין פילדס לבד שמכיל סאבפילד שהוא סטרינג  
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
                         className="bg-gray-500 text-white px-2 py-1 rounded self-start"
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
