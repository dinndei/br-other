import { connectToDB } from "@/app/DB/connection/connectToDB";
import Course from "@/app/DB/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user } = await req.json();

    if (!user) {
        return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    try {
        await connectToDB();

        const activeCourse = await Course.findOne({ studentId: user._id, isActive: true });

        if (activeCourse) {
            return NextResponse.json({
                hasActiveCourse: true,
                message: "User has an active course",
                courseId: activeCourse._id,
            });
        }

        return NextResponse.json({
            hasActiveCourse: false,
            message: "User does not have any active courses",
        });
    } catch (error) {
        console.error("Error checking active courses:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
