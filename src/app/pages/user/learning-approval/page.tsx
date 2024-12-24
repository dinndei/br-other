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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const route = useRouter();

    const mentor = useUserStore((state) => state.user);
    // setRequestId(mentor!.learningApprovalPending!)

    console.log("mentor", mentor);
    console.log("requestId", requestId);

    useEffect(() => {
        if (mentor?.learningApprovalPending) {
            setRequestId(mentor.learningApprovalPending);
        }
    }, [mentor]);

    useEffect(() => {
        console.log("comming request");

        if (requestId) {
            fetchRequestDetails();
        }
    }, [requestId]);

    useEffect(() => {
        console.log("comming student");

        if (requesterId) {
            fetchStudentDetails();
        }
    }, [requesterId]);

    const fetchRequestDetails = async () => {
        try {
            const response = await getRequestByID(requestId)
            console.log("getRequestByID response.data", response);

            setRequestDetails(response);
            setRequesterId(response.requesterId)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (err) {
            setError('Failed to load request details.');
        } finally {
            setLoading(false);
            console.log(loading);
            
        }
    };


    const fetchStudentDetails = async () => {
        try {
            const response = await getStudentByID(requestDetails!.requesterId)
            console.log("getStudentByID ", response);

            setStudentDetails(response);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (err) {
            setError('Failed to load student details.');
        } finally {
            setLoading(false);
        }
    };


    const handleApproval = async (approved: boolean) => {
        if (approved) {
            const response = await approveCourse(studentDetails! ,mentor!, requestDetails!)
            console.log(response);
            route.push(`/pages/user/activCourse/${response.course._id}`)

        }
        else{
            await declineCourse(requestDetails!)
            route.push('/')
        }
    };

    // if (loading) {
    //     return <p>Loading request details...</p>;
    // }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!requestDetails) {
        return <p>No request found.</p>;
    }

    // return (

    //     <div style={{ padding: '20px' }}>
    //         <h1>Approve or Decline Learning Request</h1>
    //         {studentDetails ? (
    //             <>
    //                 <p>
    //                     <strong>Student Name:</strong> {studentDetails!.firstName}  {studentDetails!.lastName}
    //                 </p>
    //                 <p>
    //                     <strong>Main Field:</strong> {requestDetails.mainField}
    //                 </p>
    //                 <p>
    //                     <strong>Sub Field:</strong> {requestDetails.subField}
    //                 </p>
    //                 <div>
    //                     <button
    //                         onClick={() => handleApproval(true)}
    //                         style={{
    //                             marginRight: '10px',
    //                             backgroundColor: 'green',
    //                             color: 'white',
    //                             padding: '10px 20px',
    //                             border: 'none',
    //                             borderRadius: '5px',
    //                             cursor: 'pointer',
    //                         }}
    //                     >
    //                         Approve
    //                     </button>
    //                     <button
    //                         onClick={() => handleApproval(false)}
    //                         style={{
    //                             backgroundColor: 'red',
    //                             color: 'white',
    //                             padding: '10px 20px',
    //                             border: 'none',
    //                             borderRadius: '5px',
    //                             cursor: 'pointer',
    //                         }}
    //                     >
    //                         Decline
    //                     </button>
    //                 </div>

    //             </>) : (
    //             <p>Loading student details...</p>)}
    //     </div>
    // );
    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Approve or Decline Learning Request</h1>
            {studentDetails ? (
                <>
                    <div className="space-y-4">
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Student Name:</span> {studentDetails.firstName} {studentDetails.lastName}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Main Field:</span> {requestDetails.mainField}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Sub Field:</span> {requestDetails.subField}
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleApproval(true)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-md shadow"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleApproval(false)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-md shadow"
                        >
                            Decline
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-600 text-lg">Loading student details...</p>
            )}
        </div>
    );
    
}

export default ApproveLearningPage;
