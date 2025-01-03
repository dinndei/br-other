'use client'

import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { approveCourse, declineCourse, getRequestByID, getStudentByID } from '@/app/actions/findMentorAction';
import IUser from '@/app/types/IUser';
import ILearningRequest from '@/app/types/ILearningRequest';
import { useRouter } from 'next/navigation';

const ApproveLearningPage = () => {
    const [requestDetails, setRequestDetails] = useState<ILearningRequest>();
    const [requestId, setRequestId] = useState<string>('');
    const [requesterId, setRequesterId] = useState<string>('');
    const [studentDetails, setStudentDetails] = useState<IUser>();
    const [error, setError] = useState('');

    const route = useRouter();

    const mentor = useUserStore((state) => state.user);

    const { user, setUser } = useUserStore()

    useEffect(() => {
        if (mentor?.learningApprovalPending) {
            setRequestId(mentor.learningApprovalPending);
        }
    }, [mentor]);

    useEffect(() => {
        if (requestId) {
            fetchRequestDetails();
        }
    }, [requestId]);

    useEffect(() => {
        if (requesterId) {
            fetchStudentDetails();
        }
    }, [requesterId]);

    const fetchRequestDetails = async () => {
        try {
            const response = await getRequestByID(requestId)
            setRequestDetails(response);
            setRequesterId(response.requesterId)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (err) {
            setError('Failed to load request details.');
        } 
    };


    const fetchStudentDetails = async () => {
        try {
            const response = await getStudentByID(requestDetails!.requesterId)
            setStudentDetails(response);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (err) {
            setError('Failed to load student details.');
        } 
    };

    const handleApproval = async (approved: boolean) => {
        if (approved) {
            const response = await approveCourse(studentDetails!, mentor!, requestDetails!)
            const updatedUser = {
                ...user,
                courses: [...(user?.courses || []), response.course._id]
            };

            setUser(updatedUser);
            route.push(`/pages/user/activCourse/${response.course._id}`)

        }
        else {
            await declineCourse(mentor!)
            route.push('/')
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!requestDetails) {
        return <p>No request found.</p>;
    }

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-blue-500 via-white to-blue-300" dir="rtl">
            <div className="absolute inset-0 bg-opacity-30 z-0">
                <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-t from-blue-200 via-white to-blue-100 rounded-full mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="mt-16 max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">
                        אישור או דחייה של בקשת למידה
                    </h1>

                    {studentDetails ? (
                        <>
                            <div className="space-y-4">
                                <p className="text-lg">
                                    <span className="font-medium text-gray-600">שם הסטודנט:</span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {studentDetails.firstName} {studentDetails.lastName}
                                    </span>
                                </p>
                                <p className="text-lg">
                                    <span className="font-medium text-gray-600">תחום ראשי:</span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {requestDetails.mainField}
                                    </span>
                                </p>
                                <p className="text-lg">
                                    <span className="font-medium text-gray-600">תחום משנה:</span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {requestDetails.subField}
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => handleApproval(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    אישור
                                </button>
                                <button
                                    onClick={() => handleApproval(false)}
                                    className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-medium px-6 py-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    דחייה
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600 text-lg text-center">
                            טוען פרטי הסטודנט...
                        </p>
                    )}
                </div>
            </div>
        </div>

    );

}

export default ApproveLearningPage;
