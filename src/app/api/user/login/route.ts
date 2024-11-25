export const dynamic = 'force-dynamic';
import { connectToDB, disconnectFromDB } from "@/app/DB/connection/connectToDB";
import User from "@/app/DB/models/UserModel";
import verifyPassword from '@/app/lib/passwordHash/comparePassword'
import { generateToken } from "@/app/lib/tokenConfig/generateToken";
import IUser from "@/app/types/IUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const user: IUser | null = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: 'userName not found' }, { status: 400 });
        }

        const isMatch = await verifyPassword(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
        }

        const token = generateToken(user._id!.toString(), user.role);

        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12,
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    finally {
        await disconnectFromDB();
    }
}

