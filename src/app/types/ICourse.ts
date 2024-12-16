import { Document, Types } from "mongoose";
import IField from "./IField";

export default interface ICourse extends Document{
    _id: Types.ObjectId;
    teacherID:Types.ObjectId,
    studentID:Types.ObjectId,
    beginingDate: Date,
    feild :IField,
    isActiv: boolean
}