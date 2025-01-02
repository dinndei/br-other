import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel'; 

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mentorId } = body;

        await connectToDB();

        const mentor = await User.findByIdAndUpdate(
            mentorId,
            { learningApprovalPending: null },
            { new: true }
        );

        if (!mentor) {
            return NextResponse.json({ message: 'Mentor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'learningApprovalPending reset successfully' });
    } catch (error) {
        console.error('Error resetting learningApprovalPending:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
