import axios from "axios";

export const loginUser = async (userName: string, password: string) => {
    console.log("comming to action", { userName, password });
const body={ userName, password };
    try {
        const response = await axios.post('/api/user/login',body);
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