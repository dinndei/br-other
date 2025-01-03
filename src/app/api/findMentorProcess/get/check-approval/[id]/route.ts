import { connectToDB } from '@/app/DB/connection/connectToDB';
import LearningRequest from '@/app/DB/models/LearningRequestModel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const requestId = req.nextUrl.pathname.split('/').pop();

    try {
        await connectToDB();

        const request = await LearningRequest.findById(requestId);

        if (!request) {
            return NextResponse.json(false);
        }

        return NextResponse.json(true);
    } catch (error) {
        console.error('Error checking request status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
