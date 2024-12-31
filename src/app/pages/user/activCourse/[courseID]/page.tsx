'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, VideoCameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { IoPower } from "react-icons/io5";

import AblyChat from '@/app/components/AblyChat';
// import VideoChat from '@/app/components/VideoChat';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { deleteCourse, getCourseByID } from '@/app/actions/courseAction';
import ICourse from '@/app/types/ICourse';
import UploadFiles from '@/app/components/UploadFiles';
import { useUserStore } from '@/app/store/userStore';

const StudyPage = () => {
    const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'upload' | 'close' | 'none'>('none');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const params = useParams();
    const route=useRouter()
    const courseID = Array.isArray(params?.courseID) ? params.courseID[0] : params.courseID;
    const [courseData, setCourseData] = useState<ICourse | null>(null);
    // const [stream, setStream] = useState<MediaStream | null>(null);
    const user = useUserStore(state => state.user)

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await getCourseByID(courseID)
                if (response.status != 200) {
                    throw new Error('Failed to fetch course data');
                }
                const data = await response.data.course;
                console.log("data", data.course);
                setCourseData(data);
                console.log("course data ", courseData);

            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseData();
    }, [courseID]);

    const handleCloseCourse = async () => {
        console.log('סגירת קורס');
        console.log("courseID", courseID);
        
        const response = await deleteCourse(courseID)
        if (response.status == 200) {
            setIsModalOpen(false);
            alert('הקורס נמחק בהצלחה.');
            route.push('/')
        }
        else{
            alert("שגיאה במחיקת הקורס, נסה שוב מאוחר יותר")
        }
    };

    const calculateDaysLeft = (beginningDate: Date): number => {
        const now = new Date();
        const endDate = new Date(beginningDate);
        endDate.setMonth(endDate.getMonth() + 1); // הוספת חודש לתאריך התחלה

        const timeDiff = endDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // חישוב ימים שנותרו
        return daysLeft;
    };

    const daysLeft = useMemo(() => calculateDaysLeft(new Date(courseData?.beginingDate!)), [courseData]);


    if (!courseData) {
        return <p>Loading...</p>;
    }



    return (
        <div className="mt-20 flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-20 bg-white shadow-md flex flex-col items-center py-6 space-y-4 fixed right-0 h-full">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`p-3 rounded-lg ${activeTab === 'chat' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
                </button>
                <button
                    onClick={() => setActiveTab('video')}
                    className={`p-3 rounded-lg ${activeTab === 'video' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <VideoCameraIcon className="h-8 w-8" />
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`p-3 rounded-lg ${activeTab === 'upload' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <ArrowUpTrayIcon className="h-8 w-8" />
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`p-3 rounded-lg ${activeTab === 'close' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <IoPower className="h-8 w-8" />
                </button>

            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md py-2 px-6 pr-40  flex flex-col items-end">
                    <h1 className="text-3xl font-semibold text-gray-800 pt-2 leading-snug tracking-tight font-sans">
                        תא ידע
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        {courseData?.feild?.mainField}    &nbsp;
                        {courseData?.feild?.subField}
                    </p>

                </header>

                {/* Content */}
                <main className="flex-1 p-6 bg-gray-50 ">
                    {activeTab === 'chat' && (
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Chat with Mentor</h3>
                            <AblyChat courseId={courseID} />
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Video Call</h3>
                            {/* <VideoChat userId={courseData!.teacherID.toString() } otherUserId={courseData!.studentID.toString()}  /> */}
                            {/* <VideoChat userId={"6761666723beecc2d11d5f45"} otherUserId={"6761666723beecc2d11d5f45"} /> */}
                            {/* <VideoChat userId={courseData.teacherID.toString()} stream={stream} />                    </div>)} */}
                        </div>)}
                    {activeTab === 'upload' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">העלאת קבצים</h2>
                            <UploadFiles courseId={courseID} userName={user!.firstName!.toString() + " " + user!.lastName!.toString()} />
                            {/* </Link> */}
                        </div>
                    )}

                </main>
            </div >

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" dir="rtl">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">האם ברצונך לסיים את הקורס?</h2>
                        <p className="text-gray-600 mb-4">
                            שים לב כי לאחר סגירת הקורס לא יהיה לך גישה לקבצים או להיסטוריית הצ'אט.
                        </p>
                        <p> הקורס יסתיים בכל מקרה בעוד {daysLeft > 0 ? daysLeft : 0} ימים.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                            >
                                ביטול
                            </button>
                            <button
                                onClick={handleCloseCourse}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                אישור
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default StudyPage;
