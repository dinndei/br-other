'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { approveCourse, declineCourse, getRequestByID, getStudentByID } from '@/app/actions/findMentorAction';
import IUser from '@/app/types/IUser';
import ILearningRequest from '@/app/types/ILearningRequest';

const ApproveLearningPage = () => {
    const router = useRouter();
    const [requestDetails, setRequestDetails] = useState<ILearningRequest>();
    const [requestId, setRequestId] = useState<string>('');
    const [requesterId, setRequesterId] = useState<string>('');
    const [studentDetails, setStudentDetails] = useState<IUser>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        }
        else{
            const response = await declineCourse(requestDetails!)
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

    return (

        <div style={{ padding: '20px' }}>
            <h1>Approve or Decline Learning Request</h1>
            {studentDetails ? (
                <>
                    <p>
                        <strong>Student Name:</strong> {studentDetails!.firstName}  {studentDetails!.lastName}
                    </p>
                    <p>
                        <strong>Main Field:</strong> {requestDetails.mainField}
                    </p>
                    <p>
                        <strong>Sub Field:</strong> {requestDetails.subField}
                    </p>
                    <div>
                        <button
                            onClick={() => handleApproval(true)}
                            style={{
                                marginRight: '10px',
                                backgroundColor: 'green',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleApproval(false)}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Decline
                        </button>
                    </div>

                </>) : (
                <p>Loading student details...</p>)}
        </div>
    );
}

export default ApproveLearningPage;
