import { Document } from "mongoose";

export default interface IFieldToDB extends Document {
    mainField: string;
    subFields: string[];
  }