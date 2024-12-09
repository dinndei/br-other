import { Document } from "mongoose";

export default interface ILearningRequest extends Document {
  requesterId: string;
  mainField: string;
  subField: string;
  createdAt: Date;
  expiresAt: Date;
}