'use client';

import { findMentors, saveLearningRequest } from '@/app/actions/findMentorAction';
import useDataStore from '@/app/store/fieldsStore';
import { useUserStore } from '@/app/store/userStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldsInputList from '@/app/components/FieldsInputList';
import toast from 'react-hot-toast';

const NewLearningPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [fields, setFields] = useState([{ mainField: '', subField: '' }]);
    const [isSearching, setIsSearching] = useState(false);
    const user = useUserStore(state => state.user);
    const router = useRouter();
    const { fetchFieldsData, setFieldsData } = useDataStore();

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
        const selectedField = fields[0];
        const { mainField, subField } = selectedField;

        if (mainField && subField) {
            try {
                const saveRequestResponse = await saveLearningRequest(user!._id as string, mainField, subField);
                if (saveRequestResponse.status == 201) {
                    console.log('בקשה נשמרה בהצלחה:', saveRequestResponse);

                    const response = await findMentors(user!, saveRequestResponse.data.request);
                    if (response)
                        setIsSearching(true);
                } else {
                    toast.error('אירעה שגיאה בשמירת הבקשה');
                }
            } catch (error) {
                console.error('שגיאה במהלך שמירת הבקשה או החיפוש:', error);
                toast.error('לא נמצאו מורים מתאימים או הייתה שגיאה');
            }
        } else {
            toast('בחר תחום ותת-תחום על מנת להמשיך', { icon: '📩' });
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
                                onClick={onSubmit}
                                className="bg-blue-500 text-white py-2 px-6 rounded-lg w-full mr-2"
                            >
                                חפשו לי מנטור
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-red-500 text-white py-2 px-6 rounded-lg w-full ml-2"
                            >
                                ביטול
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
