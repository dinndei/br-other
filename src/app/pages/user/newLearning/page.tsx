// 'use client'
// import { findMentors, saveLearningRequest } from '@/app/actions/findMentorAction';
// import useDataStore from '@/app/store/fieldsStore';
// import { useUserStore } from '@/app/store/userStore';
// import IUser from '@/app/types/IUser';
// import { useEffect, useState } from 'react';
// // import { Controller, useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import FieldsInputList from '@/app/components/FieldsInputList';

// const NewLearningPage: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(true);
//     const [fields, setFields] = useState([{ mainField: '', subField: '' }]); // נתוני השדות

//     const [isSearching, setIsSearching] = useState(false);
//     const [mentors, setMentors] = useState<IUser[]>([]);
//     const user = useUserStore(state => state.user);
//     const router = useRouter();
//     const { fieldsData, fetchFieldsData, setFieldsData } = useDataStore();

//     // const [selectedMainField, setSelectedMainField] = useState<string>("");
//     // const [selectedSubField, setSelectedSubField] = useState<string>("");

//    // const { control, handleSubmit, setValue, formState: { } } = useForm();
//     console.log(mentors);



//     useEffect(() => {
//         const savedFields = JSON.parse(localStorage.getItem('fields') || '[]');
//         if (savedFields.length > 0) {
//             setFieldsData(savedFields);
//         } else {
//             fetchFieldsData();
//         }
//     }, [fetchFieldsData, setFieldsData]);

//     console.log('Current fields in store:', fieldsData);

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         router.push('/')
//     }


//     const onSubmit = async () => {
//         const selectedField = fields[0]; // מניחים שיש רק שדה אחד בטופס
//         const { mainField, subField } = selectedField;

//         if (mainField && subField) {
//             try {
//                 const saveRequestResponse = await saveLearningRequest(user!._id as string, mainField, subField);
//                 if (saveRequestResponse.status == 201) {
//                     console.log('בקשה נשמרה בהצלחה:', saveRequestResponse);

//                     const response = await findMentors(saveRequestResponse.data.request);
//                     console.log('Mentors found:', response);

//                     setMentors(response);
//                     setIsSearching(true);
//                 } else {
//                     alert('אירעה שגיאה בשמירת הבקשה');
//                 }
//             } catch (error) {
//                 console.error('שגיאה במהלך שמירת הבקשה או החיפוש:', error);
//                 alert('לא נמצאו מורים מתאימים או הייתה שגיאה');
//             }
//         } else {
//             alert('בחר תחום ותת-תחום על מנת להמשיך');
//         }
//     };

//     return (
//         <div className="relative min-h-screen bg-gray-900 text-white">

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-lg w-96">
//                         <h2 className="text-xl font-semibold mb-4">למידה חדשה</h2>

//                         <FieldsInputList
//                             fields={fields}
//                             setFields={setFields}
//                             showEditButtons={false} 
//                         />


//                         <button
//                             onClick={handleCloseModal}
//                             className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
//                         >
//                             סגור
//                         </button>

//                         <button
//                             onClick={onSubmit}
//                             className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
//                         >
//                             המשך
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Modal for Searching Mentors */}
//             {isSearching && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-lg w-96">
//                         <h2 className="text-xl font-semibold mb-4 text-black">אנו מחפשים עבורך מנטור מתאים</h2>
//                         <p className="text-black">נודיע לך במייל ברגע שיתקבל</p>
//                         <button
//                             onClick={() => router.push('/')}
//                             className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
//                         >
//                             חזור לדף הבית
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default NewLearningPage;


'use client';
import { findMentors, saveLearningRequest } from '@/app/actions/findMentorAction';
import useDataStore from '@/app/store/fieldsStore';
import { useUserStore } from '@/app/store/userStore';
import IUser from '@/app/types/IUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldsInputList from '@/app/components/FieldsInputList';

const NewLearningPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [fields, setFields] = useState([{ mainField: '', subField: '' }]); // נתוני השדות
    const [isSearching, setIsSearching] = useState(false);
    const [mentors, setMentors] = useState<IUser[]>([]);
    const user = useUserStore(state => state.user);
    const router = useRouter();
    const { fieldsData, fetchFieldsData, setFieldsData } = useDataStore();

    console.log(mentors, fieldsData);


    useEffect(() => {
        const savedFields = JSON.parse(localStorage.getItem('fields') || '[]');
        if (savedFields.length > 0) {
            setFieldsData(savedFields);
        } else {
            fetchFieldsData();
        }
    }, [fetchFieldsData, setFieldsData]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        router.push('/');
    };

    const onSubmit = async () => {
        const selectedField = fields[0]; // מניחים שיש רק שדה אחד בטופס
        const { mainField, subField } = selectedField;

        if (mainField && subField) {
            try {
                const saveRequestResponse = await saveLearningRequest(user!._id as string, mainField, subField);
                if (saveRequestResponse.status == 201) {
                    console.log('בקשה נשמרה בהצלחה:', saveRequestResponse);

                    const response = await findMentors(saveRequestResponse.data.request);
                    console.log('Mentors found:', response);

                    setMentors(response);
                    setIsSearching(true);
                } else {
                    alert('אירעה שגיאה בשמירת הבקשה');
                }
            } catch (error) {
                console.error('שגיאה במהלך שמירת הבקשה או החיפוש:', error);
                alert('לא נמצאו מורים מתאימים או הייתה שגיאה');
            }
        } else {
            alert('בחר תחום ותת-תחום על מנת להמשיך');
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-white">

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">בחר תחום למידה</h2>

                        <p className="text-lg text-gray-600 mb-4 text-center">
                            אנא בחר את התחום בו אתה מעוניין
                        </p>

                        <FieldsInputList
                            fields={fields}
                            setFields={setFields}
                            showEditButtons={false} 
                        />

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="bg-red-500 text-white py-2 px-6 rounded-lg w-full mr-2"
                            >
                                סגור
                            </button>
                            <button
                                onClick={onSubmit}
                                className="bg-green-500 text-white py-2 px-6 rounded-lg w-full ml-2"
                            >
                                המשך
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Searching Mentors */}
            {isSearching && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">מחפשים עבורך מנטור</h2>
                        <p className="text-lg text-gray-600 mb-6 text-center">
                            אנו מחפשים את המנטור המתאים ביותר עבורך. נודיע לך במייל כאשר יתקבל המנטור.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg w-full"
                        >
                            חזור לדף הבית
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewLearningPage;
