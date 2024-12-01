import { connectToDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userName } = await req.json();


    if (!userName ) {
        return NextResponse.json({ message: 'Username are required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const user = await User.findOne({ userName }).select('email');

        if (!user) {
            return NextResponse.json({ message: 'userName not found' }, { status: 400 });
        }
        const response = NextResponse.json({
            message: 'Login successful',
            email: user.email,
            success: true
        });
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}