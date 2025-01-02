import IFieldToDB from "@/app/types/IFieldToDB";
import mongoose, { Schema } from "mongoose";

const FieldToDBSchema: Schema = new Schema({
  mainField: { type: String, required: true, unique: true },
  subFields: [{ type: String, required: true }]
});

export default mongoose.models.Field || mongoose.model<IFieldToDB>('Field', FieldToDBSchema);