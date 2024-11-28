import axios, { AxiosResponse } from "axios";
import IUser from "../types/IUser";

export const loginUser = async (userName: string, password: string) => {
    console.log("comming to action", { userName, password });

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

export const signupUser = async (user: Partial<IUser>) :Promise<Partial<IUser>>=> {
    try {
        const response: AxiosResponse<Partial<IUser>>= await axios.post('/api/user/signup', { user });
        return response.data;
     } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Signup failed");
        }
        throw new Error("Unexpected error occurred during signup.");
        
    }
}

export const resetPassword = async (username:string, newPassword:string) => {
    console.log("comming to action", { username, newPassword });
    
    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.post('/api/user/reset-password', { username, newPassword });
        console.log(" response.data",  response.data);
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Signup failed");
        }
        throw new Error("Unexpected error occurred during signup.");
        
    }
}


export const editUser = async (userId: string, user: Partial<IUser>): Promise<Partial<IUser>> => {
    try {
        const response: AxiosResponse<Partial<IUser>> = await axios.put('/api/user/edit-profile', { userId, ...user });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update user");
        }
        throw new Error("Unexpected error occurred during user update");
    }
};
