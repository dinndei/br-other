import { connectToDB } from "@/app/DB/connection/connectToDB";
import ChatMessage from "@/app/DB/models/ChatMessageModel";
import { NextRequest, NextResponse } from "next/server";

// טיפול בבקשת DELETE
export async function DELETE(req: NextRequest, { params }: { params: { messageId: string } }) {
    const { messageId } = params;

    if (!messageId) {
        return NextResponse.json({ message: "messageId is required" }, { status: 400 });
    }

    try {
        await connectToDB();
        
        // מחיקת ההודעה לפי מזהה
        const deletedMessage = await ChatMessage.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
