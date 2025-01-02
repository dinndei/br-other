import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel';
import IUser from '@/app/types/IUser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop();
    
    try {
        await connectToDB();

        const user :IUser|null = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({user:user}, { status: 200 });
                 
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
