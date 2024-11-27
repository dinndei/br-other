import { connectToDB, disconnectFromDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { hashPassword } from '@/app/lib/passwordHash/hashPassword'; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { username, newPassword } = await req.json();

    if (!username || !newPassword) {
        return NextResponse.json({ message: 'Username and new password are required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const user = await User.findOne({ userName: username });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await disconnectFromDB();
    }
}
