
import ICourse from "@/app/types/ICourse";
import mongoose, { Model, Schema } from "mongoose";
import fieldSchema from "./FieldModel";

const ICourseSchema: Schema<ICourse> = new Schema({
    teacherID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    beginingDate: { type: Date, required: true },
    feild: { type: fieldSchema }

})


const Course: Model<ICourse> = mongoose.models.Course || mongoose.model("Course", ICourseSchema);

export default Course;