import axios from "axios";
import IUser from "../types/IUser";

export const loginUser = async(username: string, password: string) => {
    try {
        const response = await axios.post('/api/user/login', { username, password });
        return response.data;  
    } catch (error) {
        
        if (error) {
            return { error};
        } else {
            return { error: 'Something went wrong. Please try again.'};
        }
    }
}

export const signupUser = async(user: IUser) => {
    try {
        const response = await axios.post('/api/user/signup', { user});
        return response.data;  
    } catch (error) {
        
        if (error) {
            return { error};
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}

export const resetPassword = () => {

}