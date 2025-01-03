import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";

export const loginUser = async (userName: string, password: string) => {
    try {
        const response = await axios.post('/api/user/login', { userName, password });
        return response.data;
    } catch (error) {

        if (error) {
            return { error };
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}

export const signupUser = async (user: Partial<IUser>): Promise<Partial<IUser>> => {
    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.post('/api/user/signup', { user });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Signup failed");
        }
        throw new Error("Unexpected error occurred during signup.");

    }
}

export const findUserByUsername = async (userName: string) => {
    try {
        const response: AxiosResponse = await axios.post('/api/user/findByUserName', { userName });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "userName not found");
        }
        throw new Error("Unexpected error occurred during find userName.");

    }
}

export const sendOtpCode = async (email: string) => {
    try {
        const response: AxiosResponse = await axios.post('/api/user/sendOtp', { email });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "faild to send otp Code");
        }
        throw new Error("Unexpected error occurred during send otp.");

    }
}

export async function verifyOTP(email: string, otpInput: string) {
    try {
        // שליחה ל-API (קרא לפונקציה verifyOTP)
        const response = await axios.post('/api/user/verifyCode', {
            email: email,
            otpInput: otpInput
        });

        if (response.data.success) {
            return { success: true, message: response.data.message }
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error during OTP verification', error);
        return { success: false, message: 'שגיאה במהלך אימות הקוד. אנא נסה שנית.' };
    }
}

export const resetPassword = async (username: string, newPassword: string) => {
    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.post('/api/user/reset-password', { username, newPassword });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Signup failed");
        }
        throw new Error("Unexpected error occurred during signup.");

    }
}


export const editUser = async (userId: string, user: Partial<IUser>): Promise<Partial<IUser>> => {
    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.put('/api/user/edit-profile',
            { userId, ...user });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update user");
        }
        throw new Error("Unexpected error occurred during user update");
    }
};

export const checkActivCourse = async (user: Partial<IUser>): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post('/api/user/check-activ-course',
            { user });
        return response.data.hasActiveCourse
            ;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to check activ course");
        }
        throw new Error("Unexpected error occurred during check activ course");
    }
};

export const checkRefusalCnt = async (user: Partial<IUser>): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post('/api/user/check-refusal-cnt',
            { user });
        return response.data.refusalCnt;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to check refusal cnt");
        }
        throw new Error("Unexpected error occurred during check refusal cnt");
    }
};

export const getUserById = async (id: string): Promise<Partial<IUser>> => {
    try {
        const response = await axios.get(`/api/user/get/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}



