import { connectToDB, disconnectFromDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import { hashPassword } from '@/app/lib/passwordHash/hashPassword';
import { generateToken } from "@/app/lib/tokenConfig/generateToken";
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

        const token = generateToken(user._id!.toString(), user.role);

        const response = NextResponse.json({ message: 'Password reset successfully',
            user:user,
            token:token
         });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12,
        });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await disconnectFromDB();
    }
}
