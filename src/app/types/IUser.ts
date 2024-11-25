import { Gender } from "./enums/gender";

export default interface IUser extends Document{
firstName:string,
lastName:string,
userName:string,
age:number,
password:string,
gender:Gender,
fields:[IField],
password:string,

}

