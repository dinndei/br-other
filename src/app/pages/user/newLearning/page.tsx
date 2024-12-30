'use client';
import { findMentors, saveLearningRequest } from '@/app/actions/findMentorAction';
import useDataStore from '@/app/store/fieldsStore';
import { useUserStore } from '@/app/store/userStore';
import IUser from '@/app/types/IUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldsInputList from '@/app/components/FieldsInputList';
import { findUserByUsername } from '@/app/actions/userActions';
import { getCourseByID } from '@/app/actions/courseAction';
import toast from 'react-hot-toast';

const NewLearningPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [fields, setFields] = useState([{ mainField: '', subField: '' }]); // נתוני השדות
    const [isSearching, setIsSearching] = useState(false);
    const [mentors, setMentors] = useState<IUser[]>([]);
    const user = useUserStore(state => state.user);
    const router = useRouter();
    const { fetchFieldsData, setFieldsData } = useDataStore();

    console.log(mentors);


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
            if (!(await validateLearningEligibility())) {
                return;
            }

            try {
                const saveRequestResponse = await saveLearningRequest(user!._id as string, mainField, subField);
                if (saveRequestResponse.status == 201) {
                    console.log('בקשה נשמרה בהצלחה:', saveRequestResponse);

                    const response = await findMentors(user!, saveRequestResponse.data.request);
                    console.log('Mentors found:', response);

                    setMentors(response);
                    setIsSearching(true);
                } else {
                    toast.error('אירעה שגיאה בשמירת הבקשה');
                }
            } catch (error) {
                console.error('שגיאה במהלך שמירת הבקשה או החיפוש:', error);
                toast.error('לא נמצאו מורים מתאימים או הייתה שגיאה');
            }
        } else {
            toast('בחר תחום ותת-תחום על מנת להמשיך',{icon:'📩'});
        }
    };


    const validateLearningEligibility = async () => {
        if (!user || !user.courses || user.courses.length === 0) {
            toast.error('פרטי המשתמש אינם זמינים או שאין קורסים משויכים למשתמש.');
            return false;
        }

        const userFromDB = await findUserByUsername(user.userName!);

        // בדיקה אם יש למידה פעילה
        for (const courseId of user.courses) {
            const response = await getCourseByID(courseId.toString());
            const course = response.data.course;

            if (course && course.isActiv && course.studentID === userFromDB._id) {
                console.log("משתמש זה כבר בתהליך למידה פעיל:", course);
                toast('יש לך כבר למידה פעילה.',{icon:'👾'});
                return false;
            }
        }

        // בדיקה אם יש יותר סירובים ממספר הקורסים שהמשתמש לימד
        let mentorCourseCount = 0;
        for (const courseId of user.courses) {
            const response = await getCourseByID(courseId.toString());
            const course = response.data.course;

            if (course && course.mentorId === user._id) {
                mentorCourseCount++;
            }
        }
        const refusalCnt = userFromDB.refusalCnt || 0;

        console.log(`Mentor Courses: ${mentorCourseCount}, Rejections: ${refusalCnt}`);

        if (refusalCnt > mentorCourseCount) {
            toast.error('לא ניתן לאשר למידה חדשה - יותר מדי סירובים.');
            return false; // מספר הסירובים גבוה ממספר הקורסים
        }
        return true;
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
