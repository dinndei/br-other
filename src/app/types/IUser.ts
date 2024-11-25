import { Document } from "mongoose";
import { Gender } from "./enums/gender";
import IField from "./IField";
import ICourse from "./ICourse";
import { ReligionLevel } from "./enums/ReligionLevel";
import { politicalAffiliation } from "./enums/politicalAffiliation";

export default interface IUser extends Document {
    firstName: string,
    lastName: string,
    userName: string,
    age: number,
    email: string,
    password: string,
    gender: Gender,
    fields: [IField],
    courses: [ICourse],
    refusalCnt: number,
    type:{
        religionLevel: ReligionLevel,
        politicalAffiliation : politicalAffiliation
    }

}

