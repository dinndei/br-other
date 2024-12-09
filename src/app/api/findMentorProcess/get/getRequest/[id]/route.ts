
import { connectToDB } from '@/app/DB/connection/connectToDB';
import LearningRequestModel from '@/app/DB/models/LearningRequestModel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    const id =params.id;

    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const request = await LearningRequestModel.findById(id).exec();

        if (!request) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json(request, { status: 200 });
    } catch (error) {
        console.error('Error fetching request:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
