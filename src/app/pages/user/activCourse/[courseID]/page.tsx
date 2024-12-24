'use client';

import { useEffect, useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, VideoCameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import AblyChat from '@/app/components/AblyChat';
import VideoChat from '@/app/components/VideoChat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { getCourseByID } from '@/app/actions/courseAction';
import ICourse from '@/app/types/ICourse';
import UploadFiles from '@/app/components/UploadFiles';
import { useUserStore } from '@/app/store/userStore';

const StudyPage = () => {
    const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'upload' | 'none'>('none');
    // const router = useRouter();
    const params = useParams();
    const courseID = Array.isArray(params?.courseID) ? params.courseID[0] : params.courseID;
    const [courseData, setCourseData] = useState<ICourse | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const user = useUserStore(state => state.user)

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await getCourseByID(courseID)
                if (response.status != 200) {
                    throw new Error('Failed to fetch course data');
                }
                const data = await response.data.course.course;
                console.log("data", data.course);
                setCourseData(data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseData();
    }, [courseID]);

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(localStream);
            } catch (error) {
                console.error('Error getting media:', error);
            }
        };

        getUserMedia();

        // ניקוי ה-`stream` כאשר הקומפוננטה מתנתקת
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (!stream || !courseData) {
        return <p>Loading...</p>;
    }



    return (
        <div className="flex h-screen bg-gray-100">
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
                            <VideoChat userId={courseData.teacherID.toString()} stream={stream} />                    </div>)}

                    {activeTab === 'upload' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Files</h2>
                            {/* <Link
                                href={`/upload-files/6763f73f3b12e25ed1e2971d`}
                                className="text-blue-500 hover:underline"
                            > */}
                            <UploadFiles courseId={courseData!._id.toString()} userName={user!.firstName!.toString() + " " + user!.lastName!.toString()} />
                            {/* </Link> */}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default StudyPage;
