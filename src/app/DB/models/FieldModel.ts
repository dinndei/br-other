import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
});

export default fieldSchema;