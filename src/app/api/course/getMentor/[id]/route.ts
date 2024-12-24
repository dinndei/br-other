import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel';
import IUser from '@/app/types/IUser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const mentorId = req.nextUrl.pathname.split('/').pop();

    console.log("mentorId", mentorId);
    
    try {
        await connectToDB();

        const mentor :IUser|null = await User.findById(mentorId);

        if (!mentor) {
            return NextResponse.json({ message: 'Mentor not found' }, { status: 404 });
        }

        return NextResponse.json({mentor:mentor}, { status: 200 });
                 
    } catch (error) {
        console.error('Error fetching mentor:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
