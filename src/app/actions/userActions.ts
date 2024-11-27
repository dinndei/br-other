import axios from "axios";
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

export const signupUser = async (user: IUser) => {
    try {
        const response = await axios.post('/api/user/signup', { user });
        return response.data;
    } catch (error) {

        if (error) {
            return { error };
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}

export const resetPassword = async (username:string, newPassword:string) => {
    console.log("comming to action", { username, newPassword });
    
    try {
        const response = await axios.post('/api/user/reset-password', { username, newPassword });
        console.log(" response.data",  response.data);
        
        return response.data.message;
    } catch (error) {

        if (error) {
            return { error:'oooppppsss' };
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}