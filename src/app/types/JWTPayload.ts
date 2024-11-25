import { Types } from "mongoose";
import { Role } from "./enums/role";

export default interface JWTPayload{
    _id:Types.ObjectId;
    role:Role;

}