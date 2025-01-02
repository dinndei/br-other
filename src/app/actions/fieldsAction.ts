import axios from "axios";

export const loginUser = async (userName: string, password: string) => {
    const body = { userName, password };
    try {
        const response = await axios.post('/api/user/login', body);
        return response.data;
    } catch (error) {
        if (error) {
            return { error };
        } else {
            return { error: 'Something went wrong. Please try again.' };
        }
    }
}