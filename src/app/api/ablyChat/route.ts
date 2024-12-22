import { connectToDB } from "@/app/DB/connection/connectToDB";
import ChatMessage from "@/app/DB/models/ChatMessageModel";
import { NextRequest, NextResponse } from "next/server";

// טיפול בבקשת POST: שמירת הודעה חדשה
export async function POST(req: NextRequest) {
    try {
        const { username, text ,courseId} = await req.json();
        await connectToDB();
        const newMessage = new ChatMessage({ username, text,courseId, timestamp: new Date() });
        await newMessage.save();

        return NextResponse.json({ message: "Message saved successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
