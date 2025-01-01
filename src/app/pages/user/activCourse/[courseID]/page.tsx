'use client';
import { useEffect, useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, VideoCameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import AblyChat from '@/app/components/AblyChat';
import { useParams } from 'next/navigation';
import { getCourseByID } from '@/app/actions/courseAction';
import ICourse from '@/app/types/ICourse';
import UploadFiles from '@/app/components/UploadFiles';
import { useUserStore } from '@/app/store/userStore';
import VideoChat from '@/app/components/VideoCall';

const StudyPage = () => {
    const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'upload' | 'none'>('none');
    const params = useParams();
    const courseID = Array.isArray(params?.courseID) ? params.courseID[0] : params.courseID;
    const [courseData, setCourseData] = useState<ICourse | null>(null);
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

    if (!courseData) {
        return <p>Loading...</p>;
    }



    return (
        <div dir='rtl' className="flex h-screen bg-gray-100  w-full md:w-[900px] mx-auto shadow-md rounded-lg mt-28">
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
            </div>

            {/* Content */}
            <main className="flex-1 p-6 bg-gray-50 w-full">
                {activeTab === 'none' && (
                    <div className="relative bg-cover bg-center h-[400px] flex items-center justify-center text-center" style={{ backgroundImage: 'url(https://www.hrus.co.il/wp-content/uploads/%D7%94%D7%9B%D7%A9%D7%A8%D7%94-%D7%9C%D7%9E%D7%99%D7%93%D7%94-%D7%94%D7%9B%D7%A9%D7%A8%D7%94-%D7%95%D7%A7%D7%95%D7%A8%D7%A1%D7%99%D7%9D-%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D-1-1000x580.jpg)' }}>
                        <div className="absolute inset-0 bg-black opacity-70"></div> {/* מסך שקוף על התמונה */}
                        <div className="relative z-10 text-white">
                            <h1 className="text-4xl font-bold mb-4">ברוך הבא לתא ידע</h1>
                            <p className="text-2xl mt-2">
                                בתחום &nbsp;
                                {courseData?.feild?.mainField}  -  &nbsp;
                                {courseData?.feild?.subField}
                            </p>
                            <p>לרשותך חדר למידה המצויד בשלל אפשרויות לתקשורת עם הפרטנר שהותאם לך על ידי האלגוריתם שלנו,<br/> לרבות צ&apos;אט לשליחת הודעות טקסט, שיחת וידאו וכן אפשרות להעלאת קבצים <br/>כל זאת על מנת לאפשר לכם את מירב התנאים ללמידה יעילה ופוריה <br/>חשוב לזכור את המטרה של כולנו-הגברת האחווה והשלום בעם ישראל. <br/>לכן חשוב מאוד לשמור על שפה הולמת*, כבוד, הבנה והכלת השונות</p>
                            <p>*במערכת קיימת בקרה אוטומטית על תוכן ההודעות הנשלחות, הודעות אלימות או רעילות תחסמנה לשליחה</p>
                            <p className="mt-6 text-xl font-semibold">בהצלחה!</p>
                        </div>
                    </div>
                )}
                {activeTab === 'chat' && (
                    <div>

                        <AblyChat courseId={courseID} />
                    </div>
                )}

                {activeTab === 'video' && (
                    <div>

                        {/* <VideoChat teacher={user?._id==courseData.teacherID} teacherId={String(courseData.teacherID)} studentId={String(courseData.studentID)}/> */}
                        <VideoChat teacher={true} teacherId="6756e3cd880448d29fc4a78f" studentId="6761478a0a93b67d9901a805" />

                    </div>)}
                {activeTab === 'upload' && (
                    <div>

                        <UploadFiles courseId={courseID} userName={user!.firstName!.toString() + " " + user!.lastName!.toString()} />
                        {/* </Link> */}
                    </div>
                )}
            </main>
        </div >

    );
}

export default StudyPage;
