import { connectToDB } from "@/app/DB/connection/connectToDB";
import ChatMessage from "@/app/DB/models/ChatMessageModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;
    
    if (!courseId) {
        return NextResponse.json({ message: "courseId is required" }, { status: 400 });
    }

    try {
        await connectToDB();
        
        // שליפה של ההודעות לפי courseId
        const messages = await ChatMessage.find({ courseId }).sort({ timestamp: -1 });

        if (messages.length === 0) {
            return NextResponse.json({ message: "No messages found for this courseId" }, { status: 404 });
        }

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

