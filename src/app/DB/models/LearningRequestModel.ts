import ILearningRequest from "@/app/types/ILearningRequest";
import mongoose, { Schema } from "mongoose";

const LearningRequestSchema = new Schema<ILearningRequest>({
  requesterId: { type: String, required: true, unique: true },
  mainField: { type: String, required: true },
  subField: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // תוקף של שבוע
});

export default mongoose.models.LearningRequest || mongoose.model<ILearningRequest>('LearningRequest', LearningRequestSchema);


