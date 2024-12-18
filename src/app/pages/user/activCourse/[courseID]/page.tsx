'use client';

import { getCourseByID } from '@/app/actions/courseAction';
import VideoChat from '@/app/components/VideoChat';
import ICourse from '@/app/types/ICourse';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StudyPage = (
    // { params }: { params: { courseId: string } }
) => {
    const params = useParams(); 
    const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId;    const router = useRouter();
    const [courseData, setCourseData] = useState<ICourse | null>(null);


    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await getCourseByID(courseId)
                if (!response.ok) {
                    throw new Error('Failed to fetch course data');
                }
                const data = await response.json();
                setCourseData(data);
                console.log(courseData);
                
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseData();
    }, [courseId]);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Study Session</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Welcome to your study session for Course ID: <strong>{courseId}</strong>
                    </p>
                </header>

                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Resources</h2>

                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Chat with Mentor</h3>
                            <Link href={`/chat/${courseId}`} className="text-blue-500 hover:text-blue-700">
                                Start Chat
                            </Link>
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Video Call</h3>
                            {/* <VideoChat userId={courseData!.teacherID.toString() } otherUserId={courseData!.studentID.toString()}  /> */}
                            <VideoChat userId={"1234"} otherUserId={"1234"}  />
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-gray-700">Upload Files</h3>
                            <Link href={`/upload-files/${courseId}`} className="text-blue-500 hover:text-blue-700">
                                Upload Files
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-block px-6 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyPage;
