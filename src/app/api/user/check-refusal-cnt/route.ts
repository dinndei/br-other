import { connectToDB } from "@/app/DB/connection/connectToDB";
import Course from "@/app/DB/models/CourseModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user } = await req.json();
    console.log("user", user);
    

    if (!user) {
        return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    try {
        await connectToDB();

        const studies = await Course.find({ studentID: user._id });
        console.log("studies", studies);
        
        if (studies.length<user.refusalCnt) {
            return NextResponse.json({
                refusalCnt: true,
                message: "User has more studies",
            });
        }

        return NextResponse.json({
            refusalCnt: false,
            message: "User does not have more studies",
        });
    } catch (error) {
        console.error("Error checking refusal cnt:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
