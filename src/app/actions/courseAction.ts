import axios, { AxiosResponse } from "axios";

export const getCourseByID = async (courseId: string) => {
    console.log("comming to action with:", courseId);

    try {
        const response: AxiosResponse = await axios.get(`/api/course/get/${courseId}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching course:", error);
        throw error;
    }
}