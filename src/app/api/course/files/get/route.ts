import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';
import File from '@/app/DB/models/FileModel';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const courseId = url.searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        await connectToDB();

        const files = await File.find({ courseId }).select('fileUrl userName'); 
        return NextResponse.json(files, { status: 200 });
    } catch (error) {
        console.error("Error fetching files:", error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
