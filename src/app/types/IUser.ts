import mongoose, { Document } from "mongoose";
import { Gender } from "./enums/gender";
import { ReligionLevel } from "./enums/ReligionLevel"
import { PoliticalAffiliation } from "./enums/politicalAffiliation";
import { Role } from "./enums/role";

export default interface IUser extends Document {
    firstName: string,
    lastName: string,
    userName: string,
    age: number,
    email: string,
    password: string,
    gender: Gender,
    role: Role,
    fields: {
        mainField: string;
        subField: string;
    }[];
    learningApprovalPending: string | null; // מנטור ממתין לאישור
    activeLearningRequestPending: string | null; // בקשה פעילה ממתינה לאישור
    courses: mongoose.Types.ObjectId[];
    refusalCnt: number,
    typeUser: {
        religionLevel: ReligionLevel,
        politicalAffiliation: PoliticalAffiliation
    },
    profileImage?: string;
}

