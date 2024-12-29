import axios, { AxiosResponse } from "axios";

// שליחת הודעה לשרת
export const sendMessage = async (username: string, text: string ,courseId:string): Promise<void> => {
    try {
        await axios.post("/api/ablyChat", { username, text ,courseId});
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }
};

// שליפת כל ההודעות מהשרת
export const fetchMessagesByCourseId = async (courseId: string): Promise<{ username: string; text: string;courseId:string; timestamp: string }[]> => {
    try {
        const response: AxiosResponse<{ messages: { username: string; text: string;courseId:string; timestamp: string }[] }> = await axios.get(`/api/ablyChat/${courseId}`);
        return response.data.messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw new Error("Failed to fetch messages");
    }
};

// מחיקת הודעה לפי ID
export const deleteMessage = async (messageId: string): Promise<void> => {
    try {
        await axios.delete(`/api/ablyChat/delete/${messageId}`);
    } catch (error) {
        console.error("Error deleting message:", error);
        throw new Error("Failed to delete message");
    }
};