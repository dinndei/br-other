import { connectToDB } from '@/app/DB/connection/connectToDB';
import Course from '@/app/DB/models/CourseModel';
import ICourse from '@/app/types/ICourse';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const courseId = req.nextUrl.pathname.split('/').pop();

    console.log("courseId", courseId);
    
    try {
        await connectToDB();

        const course :ICourse|null = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({course:course}, { status: 200 });
                 
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
