import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    mainField: { type: String, required: true },
    subField: { type: String, required: false }
});

export default fieldSchema;