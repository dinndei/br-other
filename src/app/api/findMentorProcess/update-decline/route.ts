// app/api/findMentorProcess/update-declines/route.ts
import { connectToDB } from '@/app/DB/connection/connectToDB';
import LearningRequest from '@/app/DB/models/LearningRequestModel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { requestId } = await req.json();

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        await connectToDB();

        const request = await LearningRequest.findById(requestId);

        if (!request) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }

        request.refusalCnt = (request.declinesCount || 0) + 1;

        await request.save();

        return NextResponse.json({ message: 'Declines count updated successfully', request });
    } catch (error) {
        console.error('Error updating declines count:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
