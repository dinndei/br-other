import { Document } from "mongoose";
import { Gender } from "./enums/gender";
import IField from "./IField";
import ICourse from "./ICourse";
import { ReligionLevel } from "./enums/ReligionLevel";
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
    fields: [IField],
    courses: [ICourse],
    refusalCnt: number,
    typeUser:{
        religionLevel: ReligionLevel,
        politicalAffiliation : PoliticalAffiliation
    }
}

