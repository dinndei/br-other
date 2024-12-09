
import IUser from "@/app/types/IUser";
import mongoose, { Model, Schema } from "mongoose";
import fieldSchema from "./FieldModel";
import { Gender } from "@/app/types/enums/gender";
import { Role } from "@/app/types/enums/role";

const IUserSchema: Schema<IUser> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    role: { type: String, enum: Object.values(Role), default: Role.User },
    fields: { type: [fieldSchema], default: [] },
    learningApprovalPending: { 
        type: String ,
        default: null 
      },
    courses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }], default: []
    },
    refusalCnt: { type: Number , default:0},
    typeUser: {
        type: {
            religionLevel: {
                type: String,
                required: true
            },
            politicalAffiliation: {
                type: String,
                required: true
            }
        },
        required: true
    }
})


const User: Model<IUser> = mongoose.models.User || mongoose.model("User", IUserSchema);

export default User;