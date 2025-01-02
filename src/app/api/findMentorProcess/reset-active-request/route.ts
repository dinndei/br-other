import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel'; 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    try {
        await connectToDB();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { activeLearningRequestPending: null },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Request reset successfully" });
    } catch (error) {
        console.error("Error resetting active request:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
