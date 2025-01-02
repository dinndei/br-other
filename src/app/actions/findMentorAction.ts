import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";
import ILearningRequest from "../types/ILearningRequest";
import { sortByDistance } from "../lib/sortByMatch/sortByDistance";

export const saveLearningRequest = async (requesterId: string, mainField: string, subField: string) => {
    console.log("comming to action with:", requesterId, mainField, subField);

    try {
        const response: AxiosResponse = await axios.post('/api/findMentorProcess/learning-request', {
            requesterId: requesterId,
            mainField: mainField,
            subField: subField,
        });
        console.log("response in action", response);

        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to save request");
        }
        throw new Error("Unexpected error occurred during saved request");
    }
}

export const findMentors = async (user: Partial<IUser>, request: ILearningRequest): Promise<IUser[]> => {
    console.log("comming to action with:", request);

    try {
        const response: AxiosResponse = await axios.post('/api/findMentorProcess/find-mentor', {
            mainField: request.mainField,
            subField: request.subField,
        });

        console.log("response in action", response);
        const sortedMentors = sortByDistance(user, response.data)

        processMentorsApproval(sortedMentors, request);

        return response.data

    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to find a match");
        }
        throw new Error("Unexpected error occurred during search for a mentor");
    }
}

export const processMentorsApproval = async (mentors: Partial<IUser>[], request: ILearningRequest) => {
    let approved = false;
    const timeout = 10 * 60 * 1000;  // 10 דקות המתנה

    for (const mentor of mentors) {
        try {
            await sendApprovalRequest(mentor, request);
            console.log(`Approval request sent to: ${mentor.email}`);

            const isApproved = await waitForApprovalOrTimeout(request._id as string, timeout);

            if (isApproved) {
                approved = true
                notifyUserRequestStatus(request, true, mentor)

                return;
            } else {
                console.log(`Request declined or timeout for: ${mentor.email}`);
                if (mentor._id) {
                    await resetLearningApprovalPending(mentor._id as string);
                }
            }

        } catch (error) {
            console.error(`Error processing mentor: ${mentor.email}`, error);
        }
    }
    if (!approved) {
        console.log("No mentor approved the request, notifying the requester...");
        notifyUserRequestStatus(request, false)
    }

}

const resetLearningApprovalPending = async (mentorId: string) => {
    try {
        await axios.post('/api/findMentorProcess/reset-approval-pending', {
            mentorId,
        });
        console.log(`Reset learningApprovalPending for mentor ID: ${mentorId}`);
    } catch (error) {
        console.error(`Failed to reset learningApprovalPending for mentor ID: ${mentorId}`, error);
    }
};

const notifyUserRequestStatus = async (request: Partial<ILearningRequest>, isApproved: boolean, mentor: Partial<IUser> | null = null) => {
    console.log("notifyUserRequestStatus");

    const response: AxiosResponse = await axios.post('/api/findMentorProcess/notify-user-request', {
        request: request,
        isApproved: isApproved,
        mentor: mentor
    });
    return response;
}

const sendApprovalRequest = async (mentor: Partial<IUser>, request: Partial<ILearningRequest>) => {
    const response: AxiosResponse = await axios.post('/api/findMentorProcess/sendApprovalRequest', {
        mentor: mentor,
        request: request
    });

    console.log("Approval request sent to:", mentor.email);
    return response;
}

const waitForApprovalOrTimeout = async (requestId: string, timeout: number): Promise<boolean> => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        const isDeleted = await isRequestDeleted(requestId);

        if (!isDeleted) {
            console.log("Request approved and deleted");
            return true; // האישור התקבל
        }

        console.log("Request still pending, waiting...");
        await new Promise(resolve => setTimeout(resolve, 30 * 1000)); // המתנה של 30 שניות
    }

    console.log("Timeout reached without approval");
    return false; // הזמן נגמר ללא אישור
};

const isRequestDeleted = async (requestId: string): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.get(`/api/findMentorProcess/get/check-approval/${requestId}`);
        console.log("Response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error checking request deletion status:", error);
        return false;
    }
};

export const getRequestByID = async (requestId: string) => {
    console.log("comming to action with:", requestId);

    try {

        const response: AxiosResponse = await axios.get(`/api/findMentorProcess/get/getRequest/${requestId}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching request:", error);
        throw error;
    }
}

export const getStudentByID = async (userId: string) => {
    console.log("comming to action with:", userId);

    try {
        const response: AxiosResponse = await axios.get(`/api/findMentorProcess/get/getStudent/${userId}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching student :", error);
        throw error;
    }
}

export const approveCourse = async (student: IUser, mentor: Partial<IUser>, request: ILearningRequest) => {
    console.log("comming to action with:", student, request, mentor);

    try {
        const response: AxiosResponse = await axios.post('/api/findMentorProcess/open-course', {
            student: student,
            request: request,
            mentor: mentor
        });
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching student :", error);
        throw error;
    }
}

export const declineCourse = async (request: Partial<ILearningRequest>) => {
    console.log("comming to action with:", request);

    try {
        const response: AxiosResponse = await axios.post('/api/findMentorProcess/update-decline', {
            requestId: request._id
        });
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching student :", error);
        throw error;
    }
}

export const resetActiveRequest = async (userId: string) => {
    console.log("in action", userId);

    try {
        const response: AxiosResponse = await axios.post('/api/findMentorProcess/reset-active-request', {
            userId: userId
        });
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error reset  ActiveRequest:", error);
        throw error;
    }
}






