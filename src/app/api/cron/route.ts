import { NextResponse } from 'next/server';
import { connectToDB } from "@/app/DB/connection/connectToDB";
import Course from "@/app/DB/models/CourseModel";
import ICourse from "@/app/types/ICourse";

export async function GET() {
    try {
        await connectToDB();

        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1)); 

        // מציאת הקורסים שה-`beginningDate` שלהם עבר חודש
        const coursesToUpdate: ICourse[] = await Course.find({
            beginningDate: { $lt: oneMonthAgo },
            isActive: { $ne: false }, 
        });

        if (coursesToUpdate.length === 0) {
            console.log('No courses to update');
            return NextResponse.json({ message: 'No courses to update' }, { status: 200 });
        }

        // עדכון ה-`isActive` לכל הקורסים שנמצאו
        await Course.updateMany(
            { _id: { $in: coursesToUpdate.map(course => course._id) } },
            { $set: { isActive: false } }
        );

        console.log(`Updated ${coursesToUpdate.length} courses to inactive`);
        return NextResponse.json({ message: `Updated ${coursesToUpdate.length} courses to inactive` }, { status: 200 });

    } catch (error) {
        console.error('Error updating courses:', error);
        return NextResponse.json({ error: 'Error updating courses' }, { status: 500 });
    }
}
