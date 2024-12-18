import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import { ReligionLevel } from "@/app/types/enums/ReligionLevel";
import { Gender } from "@/app/types/enums/gender";
import { Role } from "@/app/types/enums/role";
import IUser from "@/app/types/IUser";
import { sortByDistance } from "../sortByDistance";
import mongoose from "mongoose";

const user: Partial<IUser> = {
    _id: new mongoose.Types.ObjectId(),
    firstName: "David",
    lastName: "Levi",
    userName: "david123",
    age: 28,
    email: "david123@example.com",
    password: "securepassword",
    gender: Gender.Male,
    role: Role.User,
    fields: [
        { mainField: "Technology", subField: "Software Engineering" },
    ],
    learningApprovalPending: null,
    courses: [new mongoose.Types.ObjectId()],
    refusalCnt: 0,
    typeUser: {
        religionLevel: ReligionLevel.Religious,
        politicalAffiliation: PoliticalAffiliation.Right,
    },
};

const mentors: Partial<IUser>[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        firstName: "Rachel",
        lastName: "Cohen",
        userName: "mentor1",
        age: 34,
        email: "rachel.cohen@example.com",
        password: "mentorpassword1",
        gender: Gender.Female,
        role: Role.User,
        fields: [
            { mainField: "Education", subField: "Special Education" },
        ],
        learningApprovalPending: null,
        courses: [new mongoose.Types.ObjectId()],
        refusalCnt: 1,
        typeUser: {
            religionLevel: ReligionLevel.Orthodox,
            politicalAffiliation: PoliticalAffiliation.HardRight,
        },
    },
    {
        _id: new mongoose.Types.ObjectId(),
        firstName: "Michael",
        lastName: "Gross",
        userName: "mentor2",
        age: 40,
        email: "michael.gross@example.com",
        password: "mentorpassword2",
        gender: Gender.Male,
        role: Role.User,
        fields: [
            { mainField: "Art", subField: "Photography" },
        ],
        learningApprovalPending: null,
        courses: [new mongoose.Types.ObjectId()],
        refusalCnt: 2,
        typeUser: {
            religionLevel: ReligionLevel.Secular,
            politicalAffiliation: PoliticalAffiliation.Left,
        },
    },
    {
        _id: new mongoose.Types.ObjectId(),
        firstName: "Sara",
        lastName: "Weinberg",
        userName: "mentor3",
        age: 29,
        email: "sara.weinberg@example.com",
        password: "mentorpassword3",
        gender: Gender.Female,
        role: Role.User,
        fields: [
            { mainField: "Business", subField: "Marketing" },
        ],
        learningApprovalPending: null,
        courses: [new mongoose.Types.ObjectId()],
        refusalCnt: 0,
        typeUser: {
            religionLevel: ReligionLevel.Religious,
            politicalAffiliation: PoliticalAffiliation.CenterRight,
        },
    },
];

// Tests
test('sortByDistance should sort mentors correctly by combined gap', () => {
    const sortedMentors = sortByDistance(user, mentors);
    const sortedIds = sortedMentors.map(mentor => mentor.firstName);
    
    expect(sortedIds).toEqual([
        mentors[0].firstName,
        mentors[2].firstName,
        mentors[1].firstName,
    ]);
});
