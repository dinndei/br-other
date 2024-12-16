'use client'
import { findMentor, saveLearningRequest } from '@/app/actions/findMentorAction';
import useDataStore from '@/app/store/fieldsStore';
import { useUserStore } from '@/app/store/userStore';
import IUser from '@/app/types/IUser';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const NewLearningPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMainField, setSelectedMainField] = useState<string>("");
    const [selectedSubField, setSelectedSubField] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);
    const [mentors, setMentors] = useState<IUser[]>([]);

    const user = useUserStore(state => state.user);

    const router = useRouter();

    const { control, handleSubmit, setValue, formState: {  } } = useForm();
    console.log(mentors);


    const fieldsData = useDataStore(state => state.fields);

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        router.push('/')
    }

    const handleMainFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const field = e.target.value;
        setSelectedMainField(field);
        setSelectedSubField("");
        setValue("mainField", field);
    }

    const handleSubFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubField(e.target.value);
        setValue("subField", e.target.value);
    }

    const onSubmit = async () => {
        if (selectedMainField && selectedSubField) {

            try {
                const saveRequestResponse = await saveLearningRequest((user!._id) as string, selectedMainField, selectedSubField)
                if (saveRequestResponse.status == 201) {
                    console.log("בקשה נשמרה בהצלחה:", saveRequestResponse);

                    const response = await findMentor(saveRequestResponse.data.request);
                    console.log("Mentors found:", response);

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
            alert("בחר תחום ותת-תחום על מנת להמשיך");
        }

    }

    return (
        <div className="relative min-h-screen bg-gray-900 text-white">

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">למידה חדשה</h2>

                        <div className="mb-4">
                            <Controller
                                name="mainField"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={selectedMainField}
                                        onChange={(e) => {
                                            handleMainFieldChange(e);
                                            field.onChange(e);
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 text-black bg-white"
                                    >
                                        <option value="">בחר תחום</option>
                                        {fieldsData.map((field) => (
                                            <option key={field.mainField} value={field.mainField}>
                                                {field.mainField}
                                            </option>
                                        ))}


                                    </select>
                                )}
                            />
                        </div>

                        {/* Select for choosing sub field */}
                        <div className="mb-4">
                            <Controller
                                name="subField"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        value={selectedSubField}
                                        onChange={(e) => {
                                            handleSubFieldChange(e);
                                            field.onChange(e);
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 text-black bg-white"
                                        disabled={!selectedMainField}
                                    >
                                        <option value="">בחר תת-תחום</option>
                                        {fieldsData
                                            .filter((field) => field.mainField === selectedMainField)
                                            .flatMap((field) =>
                                                field.subFields.map((sub) => (
                                                    <option key={sub} value={sub}>
                                                        {sub}
                                                    </option>
                                                ))
                                            )}
                                    </select>
                                )}
                            />
                        </div>


                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                        >
                            סגור
                        </button>

                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
                        >
                            המשך
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Searching Mentors */}
            {isSearching && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-black">אנו מחפשים עבורך מנטור מתאים</h2>
                        <p className="text-black">נודיע לך במייל ברגע שיתקבל</p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
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
