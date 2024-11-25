import { Types } from "mongoose";
import { Role } from "./enums/role";

export interface JWTPayload{
    _id:Types.ObjectId;
    role:Role;

}