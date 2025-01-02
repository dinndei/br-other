// app/api/findMentorProcess/update-declines/route.ts
import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { mentorId } = await req.json();

        if (!mentorId) {
            return NextResponse.json({ message: 'mentorId is required' }, { status: 400 });
        }

        await connectToDB();

        const mentor = await User.findById(mentorId);

        if (!mentor) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }

        mentor.refusalCnt = (mentor.refusalCnt || 0) + 1;

        await mentor.save();

        return NextResponse.json({ message: 'Declines count updated successfully', mentor });
    } catch (error) {
        console.error('Error updating declines count:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
