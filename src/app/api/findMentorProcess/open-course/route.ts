import { connectToDB } from '@/app/DB/connection/connectToDB';
import UserModel from '@/app/DB/models/UserModel';
import CourseModel from '@/app/DB/models/CourseModel';
import LearningRequestModel from '@/app/DB/models/LearningRequestModel';
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import IUser from '@/app/types/IUser';

export async function POST(req: NextRequest) {
    const { student, mentor, request } = await req.json();

    if (!student || !mentor || !request) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        await connectToDB();

        const studentExists = await UserModel.findById(student._id);
        const mentorExists = await UserModel.findById(mentor._id);
        if (!studentExists || !mentorExists) {
            return NextResponse.json({ message: 'Student or mentor not found' }, { status: 404 });
        }

        const newCourse = await CourseModel.create({
            teacherID: mentor._id,
            studentID: student._id,
            beginingDate: new Date(),
            feild: {
                mainField: request.mainField,
                subField: request.subField,
            },
            isActiv: true
        });

        const courseId = new mongoose.Types.ObjectId(newCourse._id);

        studentExists.courses.push(courseId);
        mentorExists.courses.push(courseId);

        mentorExists.learningApprovalPending = null;

        await studentExists.save();
        await mentorExists.save();

        await LearningRequestModel.findByIdAndDelete(request._id);

        return NextResponse.json({ message: 'Course created successfully', course: newCourse }, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}
