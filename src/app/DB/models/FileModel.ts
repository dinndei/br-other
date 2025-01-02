import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    userName: { type: String, required: true },
    fileUrl: { type: String, required: true },
})

const File = mongoose.models.File || mongoose.model("File", fileSchema);
export default File;
