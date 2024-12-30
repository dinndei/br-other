import { connectToDB } from "@/app/DB/connection/connectToDB";
import Course from "@/app/DB/models/CourseModel";
import ICourse from "@/app/types/ICourse";
import cron from 'node-cron';


const updateInactiveCourses = async () => {
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
            return;
        }

        // עדכון ה-`isActive` לכל הקורסים שנמצאו
        await Course.updateMany(
            { _id: { $in: coursesToUpdate.map(course => course._id) } },
            { $set: { isActive: false } }
        );

        console.log(`Updated ${coursesToUpdate.length} courses to inactive`);
    } catch (error) {
        console.error('Error updating courses:', error);
    }
};

// הגדרת ה-cron job להפעיל את הפונקציה כל 24 שעות
cron.schedule('0 0 * * *', updateInactiveCourses); // כל יום ב-12 בלילה