import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";

export const loginUser = async (userName: string, password: string) => {
    console.log("comming to action", { userName, password });

    try {
        const response = await axios.post('/api/user/login',{userName, password});
        console.log("response.data", response.data);

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
    console.log("comming to action", { userName });
    try {
        const response: AxiosResponse = await axios.post('/api/user/findByUserName', { userName });
        console.log("response.data", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "userName not found");
        }
        throw new Error("Unexpected error occurred during find userName.");

    }
}

export const sendOtpCode = async (email: string) => {
    console.log("comming to action", email);

    try {
        const response: AxiosResponse = await axios.post('/api/user/sendOtp', { email });
        console.log(" response.data", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "faild to send otp Code");
        }
        throw new Error("Unexpected error occurred during send otp.");

    }
}

export async function verifyOTP(email: string, otpInput: string) {
    console.log("in action", email, otpInput);
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
    console.log("comming to action", { username, newPassword });

    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.post('/api/user/reset-password', { username, newPassword });
        console.log("response.data", response.data);

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

export const checkActivCourse = async (user: Partial<IUser>) :Promise<boolean>=> {
    console.log("in action", user);

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



