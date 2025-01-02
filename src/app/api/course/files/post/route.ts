
import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';
import File from '@/app/DB/models/FileModel';

export async function POST(request: Request) {

    try {
        const { fileUrl, courseId, userName } = await request.json();
        await connectToDB();

        const newFile = new File({
            courseId, userName, fileUrl
        });

        await newFile.save();

        return NextResponse.json({ message: 'file saved successfully', file: newFile }, { status: 201 });
    } catch (error) {
        console.error("Error saving file:", error);

        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
