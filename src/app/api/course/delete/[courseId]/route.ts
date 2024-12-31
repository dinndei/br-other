import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';
import Course from '@/app/DB/models/CourseModel';
import ChatMessage from '@/app/DB/models/ChatMessageModel';


export async function DELETE(request: Request, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        await connectToDB();

        await ChatMessage.deleteMany({ courseId });

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { isActiv: false },
            { new: true }
        );

        if (!updatedCourse) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        console.log('Chat messages deleted and course updated successfully');
        return NextResponse.json(
            {
                message: 'Chat messages deleted and course updated successfully',
                course: updatedCourse, // החזרת המידע המעודכן על הקורס
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating course or deleting chat messages:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
