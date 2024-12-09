
import { connectToDB } from '@/app/DB/connection/connectToDB';
import User from '@/app/DB/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    const id =params.id;

    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    try {
        await connectToDB();

        const student = await User.findById(id).exec();

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
